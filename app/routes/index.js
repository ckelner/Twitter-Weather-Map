exports.index = function(req, res){
  res.render(
    'index',
    {
      title: '#Weather'
    }
  );
};

exports.fullscreenmap = function(req, res){
  res.render(
    'fullscreenmap',
    {
      title: '#Weather Full Screen Map'
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
