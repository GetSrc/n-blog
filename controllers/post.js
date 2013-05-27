var Post = require('../models/post');

/**
 * 显示发表文章界面
 */
exports.showCreate = function(req, res) {
	res.render('edit', {
		action: 'create',
		title: '发表新文章 - 学习轨迹',
		user: req.session.user,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()
	});
};

/**
 * 保存新建的文章
 */
exports.saveCreate = function(req, res) {
	var currentUser = req.session.user,
		post = new Post(currentUser.name, req.body.title, req.body.post);
	post.save(function(err) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success', '发表成功');
		res.redirect('/');
	});
};

/**
 * 根据ID显示文章
 */
exports.show = function(req, res) {
	Post.getById(req.params.id, function (err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('article', {
			title: post.title +' - ' + post.name + ' - 学习轨迹',
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
};

/**
 * 显示编辑文章界面
 */
exports.showEdit = function(req, res) {

	Post.getById(req.params.id, function(err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		res.render('edit', {
			action: 'edit',
			title: '[编辑] ' + post.title +' - ' + post.name + ' - 学习轨迹',
			post: post,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
};

/**
 * 保存编辑的文章
 */
exports.saveEdit = function(req, res) {

	var currentUser = req.session.user,
		post = new Post(currentUser.name, req.body.title, req.body.post);
	Post.update(req.params.id, post, function(err, post) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		req.flash('success','更新成功');
		res.redirect('/article/'+req.params.name+'/'+req.params.id);
	});
};


/**
 * 删除文章
 */
exports.remove = function(req, res) {

	var currentUser = req.session.user;
	Post.remove(req.params.id, function(err, count) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		if(count){
			req.flash('error','删除失败');
			return res.redirect('/');
		}
		req.flash('success','删除成功');
		res.redirect('/');
	});
};