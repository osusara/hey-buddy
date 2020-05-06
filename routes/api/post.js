const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const Dare = require("../../models/Dare");

// @route   POST api/post
// @desc    Create a post
// @access  Private
router.post("/", auth, async (req, res) => {
  try {

    // get sender profile
    const profile = await Profile.findOne({ user: req.user.id});

    // get a random dare
    const dare = await Dare.findOne().skip(
      Math.floor(Math.random() * Dare.count())
    );
    
    let receivers = [];
    req.body.receivers.forEach((receiver) => {
      // const user = await Profile.findOne({$and: [
      //   { user: receiver.user },
      //   { $or: [
      //     { privacy: false },
      //     { buddies: { $elemMatch: { user: req.params.user_id } } }
      //   ]},
      // ],}).populate("user", ["username, active"]);

      receivers.unshift({ user: receiver });
    });



    const newPost = new Post({
      sender: {
        user: req.user.id,
        name: profile.name,
        text: req.body.text,
      },
      dare: dare._id,
      receivers: receivers,
      // have to add replys
    });

    const post = await newPost.save()
    res.json(post);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/post
// @desc    Get posts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    let buddies = []
    profile.buddies.map(buddy => {
      buddies.unshift(buddy.user);
    });
    
    const posts = await Post.find({
      sender: {user: { $in: buddies }}
    }).sort({ date: -1 });

    res.json(posts);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/post/me
// @desc    Get my posts
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {    
    const posts = await Post
      .find({ sender: {user: req.user.id} })
      .sort({ date: -1 });

    res.json(posts);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   GET api/post/:post_id
// @desc    Get post by id
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
  try {    
    const post = await Post.findById(req.params.post_id);

    if(!post)
      return res.status(404).json({ msg: 'Post not found' });

    res.json(post);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === 'ObjectId')
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

// @route   DELETE api/post/:post_id
// @desc    Delete a post
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {    
    const post = await Post.findById(req,params.post_id);

    if(!post)
      return res.status(404).json({ msg: 'Post not found' });

    if(post.sender.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'User not authorized' });

    await post.remove();
    res.json({ msg: 'Post removed' });

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "Post not found" });

    res.status(500).send("Server error");
  }
});

// @route   PUT api/post/like/:post_id
// @desc    Highfive a post
// @access  Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if already high fived
    if(post.highfives.filter(highfive => highfive.user.toString() === req.user.id).length > 0)
      return res.status(400).json({ msg: 'Post has already been high fived' });

    post.highfives.unshift({ user: req.user.id });

    await post.save();
    res.json(post.highfives);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
})

// @route   PUT api/post/unlike/:post_id
// @desc    Remove highfive from a post
// @access  Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // check if post is not high fived
    if(post.highfives.filter(highfive => highfive.user.toString() === req.user.id).length === 0)
      return res.status(400).json({ msg: 'Post has not yet been high fived' });

    // get remove index
    const removeIndex = post.highfives
      .map(highfive => highfive.user.toStrng())
      .indexOf(req.user.id)

    post.highfives.splice(removeIndex, 1);

    await post.save();
    res.json(post.highfives);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/post/reply/:post_id
// @desc    Reply a post
// @access  Private
router.put("/reply/:post_id", [auth, [
  check('text', 'Text can not be empty').not().isEmpty()
]], async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(400).json({ errors: errors.array });

  try {
    const post = await Post.findById(req.params.post_id);

    post.receivers.map(receiver => {
      if(receiver.user.toString() === req.user.id) 
        receiver.text = req.body.text;
    });

    await newPost.save();
    res.json(post.receivers);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/post/reply/:post_id/:reply_id
// @desc    Reply a post
// @access  Private
router.delete('/reply/:post_id/:reply_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    const reply = post.receivers.find(receiver => receiver.id === req.params.reply_id);

    if(!reply)
      return res.status(404).json({ msg: 'Reply does not exist' });

    if(reply.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "User not authorized" });

    const removeIndex = post.receivers
      .map(receiver => receiver.user.toString())
      .indexOf(req.user.id);

    post.receivers.splice(removeIndex, 1);
    await post.save();

    res.json(post.receivers);

  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    res.status(500).send("Server error");
  }
});

module.exports = router;
