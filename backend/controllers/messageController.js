const Message = require('../models/Message');

// POST /api/contact
const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email invalide' });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ip: req.ip,
    });

    res.status(201).json({ message: 'Message envoyé avec succès', id: newMessage._id });
  } catch (error) {
    next(error);
  }
};

// GET /api/messages (admin)
const getAllMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const query = {};
    if (unread === 'true') query.isRead = false;

    const [messages, total, unreadCount] = await Promise.all([
      Message.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      Message.countDocuments(query),
      Message.countDocuments({ isRead: false }),
    ]);

    res.json({ messages, total, unreadCount });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/messages/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });
    res.json({ message: 'Marqué comme lu', msg });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/messages/:id
const deleteMessage = async (req, res, next) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMessage, getAllMessages, markAsRead, deleteMessage };
