import Notification from '../models/Notification.js';
import { successResponse, errorResponse, paginationMeta } from '../utils/response.js';

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { userId: req.userId };
    if (read !== undefined) filter.read = read === 'true';

    const total = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    successResponse(res, {
      notifications,
      pagination: paginationMeta(parseInt(page), parseInt(limit), total),
    });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    if (notification.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    notification.read = true;
    await notification.save();

    successResponse(res, { notification });
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );

    successResponse(res, {}, 'All notifications marked as read');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    if (notification.userId.toString() !== req.userId) {
      return errorResponse(res, 'Not authorized', 401);
    }

    await Notification.findByIdAndDelete(req.params.id);

    successResponse(res, {}, 'Notification deleted');
  } catch (error) {
    errorResponse(res, error.message, 500, error);
  }
};
