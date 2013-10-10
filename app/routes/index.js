exports.index = function(req, res){
  res.render(
    'index',
    {
      title: '#Weather'
    }
  );
};


exports.rank = function(req, res){
  res.render(
    'rank',
    {
      title: '#Weather Rankings'
    }
  );
};
