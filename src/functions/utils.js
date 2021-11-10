export const getDesignName = (designPath) => {
  var dotpos = designPath.lastIndexOf(".");
  var slashpos = designPath.lastIndexOf("/") + 1;
  var roomName = designPath.substr(slashpos, dotpos - slashpos);
  return roomName;
};
export const validateEmail = email => {
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
};
