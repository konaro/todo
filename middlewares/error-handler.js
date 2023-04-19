module.exports = (err, req, res, next) => {
    req.flash('error_msg', '處理失敗')
    res.redirect('back')

    next(err)
}