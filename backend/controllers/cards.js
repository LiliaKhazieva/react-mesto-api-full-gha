const Card = require('../models/card');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors');

// return all cards
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
};

// create card
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findOne({
    _id: req.params.cardId,
  })
    .orFail()
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      return Card.deleteOne(card)
        .then(() => {
          res.send({ data: card });
        });
    }).catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      } if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail()
  .populate(['owner', 'likes'])
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    } if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    return next(err);
  });

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .populate(['owner', 'likes'])
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
    } if (err.name === 'DocumentNotFoundError') {
      return next(new NotFoundError('Передан несуществующий _id карточки'));
    }
    return next(err);
  });

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
