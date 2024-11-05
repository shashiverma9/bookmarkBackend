const Bookmark = require('../models/Bookmark');
const extractMetadata = require('../utils/scraper');

const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const addBookmark = async (req, res) => {
  const { url } = req.body;

  try {
    const metadata = await extractMetadata(url);

    const newBookmark = new Bookmark({
      url,
      title: metadata.title,
      description: metadata.description,
      previewImage: metadata.image,
      tags: metadata.tags,
      user: req.user.id,
    });

    await newBookmark.save();
    res.status(201).json(newBookmark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark || bookmark.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Bookmark not found or not authorized' });
    }

    await bookmark.remove();
    res.json({ message: 'Bookmark removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getBookmarks, addBookmark, deleteBookmark };
