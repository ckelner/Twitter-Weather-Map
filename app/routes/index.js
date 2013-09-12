exports.index = function(req, res){
  res.render(
    'index',
    {
      title: 'Real Time Social Weather'
    }
  );
};
