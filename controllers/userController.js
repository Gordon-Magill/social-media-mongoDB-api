const User = require('../models/User')

getAllUsers(req,res) {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err))
}

createUser(req,res) {
    User.create(req.body)
        .then(newData => res.status(200).json(newData))
        .catch(err => res.status(500).json(err))
}

getUserById(req,res){
    User.findOne({_id: req.params.userID})
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        .then(user => {
            !user
                ? res.status(404).json({message: `No user with ID ${req.params.userID}`})
                : res.status(200).json(user)
        })
        .catch(err => res.status(500).json(err))
}

updateUserById(req,res){
    User.findOneAndUpdate({_id: req.params.userID},{req.body})
        .then(updatedUser => res.status(200).json(updatedUser))
        .catch(err => res.status(500).json(err))
}

deleteUserById(req,res) {
    User.findOneAndDelete({_id: req.params.userID},
        (err, data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(500).json({message: `Error deleting user ${req.params.userID}`})
            }
        })
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
}