function UrlParser(urlToParse) {
  var domainPattern = '.yellowpages.com',
      separator = '.',
      url = urlToParse;

  function getDomain() {
    return domainPattern.exec(url)[2];
  };

  function getProtocol() {
    return domainPattern.exec(url)[1];
  };

  function getSubDomain(domainParts) {
    return domainParts[domainParts.length-2];
  };
  
  function getTld(domainParts) {
    return domainParts[domainParts.length-1];
  };
  
  function getCookieDomain() {
    var domainParts = getDomain().split('.');
    return separator + getSubDomain(domainParts) + separator + getTld(domainParts);
  };

  function getCookieUrl(cookiePath) {
    return getProtocol()+getDomain()+cookiePath
  }

  return {
      getDomain: getDomain,
      getCookieUrl: getCookieUrl,
      getCookieDomain:getCookieDomain,
  };
};

function CookieDeleter() {
  var parser;

  function deleteCookies(cookies) {
    for(var i=0,l=cookies.length; i<l;i++) {
      chrome.cookies.remove(
        {
          url: parser.getCookieUrl(cookies[i].path), 
          name: cookies[i].name
        }
      );
    };
  };

  function onButtonClick(tab) {
    parser = UrlParser(tab.url);
    chrome.cookies.getAll({domain: parser.getCookieDomain()}, deleteCookies);
  };

  function registerOnClickListener() {
    chrome.browserAction.onClicked.addListener(onButtonClick);
  };

  return {
    registerOnClickListener:registerOnClickListener
  };
};

CookieDeleter().registerOnClickListener();


