let accessToken = ''

window.fbAsyncInit = function() {
  FB.init({
    appId      : '159280381255285',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
  window.FB_READY()
};

(function(d, s, id){
 var js, fjs = d.getElementsByTagName(s)[0];
 if (d.getElementById(id)) {return;}
 js = d.createElement(s); js.id = id;
 js.src = "//connect.facebook.net/en_US/sdk.js";
 fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.Login = function(res) {
  if (!res || res.status !== 'connected') return FB.login((res) => {
    accessToken = res.authResponse.accessToken
    console.log(res)
  }, {scope: 'public_profile,email,manage_pages'})
}

window.FB_READY = () => {

  /**
  * TESTS
  */
  FB.getLoginStatus(function(res) {
    if (res || res.status === 'connected') accessToken = res.authResponse.accessToken
    return window.Login(res)
  }, {scope: 'public_profile,email,manage_pages'});



  let waitFacebook = setInterval(() => {
    if (accessToken) {
      clearInterval(waitFacebook);

      FB.api(`/me/accounts`, function(res) {
        const pages = res.data
        pages.map((el) => {
          const option = document.createElement('option')
          option.value = el.name
          option.setAttribute('data-access_token', el.access_token)
          option.setAttribute('data-id', el.id)
          option.innerHTML = el.name
          document.querySelector('select').appendChild(option)
          console.log(el)
        })
      })
    }



    return; // no access token, just wait for it
  },10)

  /**
  * Test Pages Select Data API
  */
  let select = document.querySelector('select')
  select.onchange = (evt) => {
    const pageId = evt.target.options[evt.target.options.selectedIndex].getAttribute('data-id')
    const accessToken = evt.target.options[evt.target.options.selectedIndex].getAttribute('data-access_token')
    FB.api(`/${pageId}?access_token=${accessToken}`,(res) => {
      console.log(res)
    }, { fields: 'bio,about,name,posts,picture,photos, is_published'})
  }

}
