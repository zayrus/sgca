


<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
    <meta charset='utf-8'>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>backbone-forms/distribution.amd/editors/list.min.js at master · powmedia/backbone-forms</title>
    <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="GitHub" />
    <link rel="fluid-icon" href="https://github.com/fluidicon.png" title="GitHub" />
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114.png" />
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-144.png" />
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144.png" />
    <link rel="logo" type="image/svg" href="https://github-media-downloads.s3.amazonaws.com/github-logo.svg" />
    <meta property="og:image" content="https://github.global.ssl.fastly.net/images/modules/logos_page/Octocat.png">
    <meta name="hostname" content="github-fe121-cp1-prd.iad.github.net">
    <meta name="ruby" content="ruby 1.9.3p194-tcs-github-tcmalloc (e1c0c3f392) [x86_64-linux]">
    <link rel="assets" href="https://github.global.ssl.fastly.net/">
    <link rel="conduit-xhr" href="https://ghconduit.com:25035/">
    <link rel="xhr-socket" href="/_sockets" />
    


    <meta name="msapplication-TileImage" content="/windows-tile.png" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta name="selected-link" value="repo_source" data-pjax-transient />
    <meta content="collector.githubapp.com" name="octolytics-host" /><meta content="collector-cdn.github.com" name="octolytics-script-host" /><meta content="github" name="octolytics-app-id" /><meta content="BEE6458F:7CEA:7E9F4DB:529A8274" name="octolytics-dimension-request_id" /><meta content="1141944" name="octolytics-actor-id" /><meta content="mateogo" name="octolytics-actor-login" /><meta content="7a1025afe2550f81e807f487b52ea26bd5d9d04fdece91c926bf30cd336b9db3" name="octolytics-actor-hash" />
    

    
    
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />

    <meta content="authenticity_token" name="csrf-param" />
<meta content="VCTqMzSWK44650fR8PxX2g0ypRayCrhirfuAbAo4Bs8=" name="csrf-token" />

    <link href="https://github.global.ssl.fastly.net/assets/github-0f5611c27a5a2a6928dc6e99d63581265b963e34.css" media="all" rel="stylesheet" type="text/css" />
    <link href="https://github.global.ssl.fastly.net/assets/github2-6102d7944435d804d870f38bf20f1e16fe40a4d0.css" media="all" rel="stylesheet" type="text/css" />
    

    

      <script src="https://github.global.ssl.fastly.net/assets/frameworks-f78f9db32da9343ba16e477c7b54aa5b971fecbd.js" type="text/javascript"></script>
      <script src="https://github.global.ssl.fastly.net/assets/github-0027dfa2fe63e83319cafa77f57322ac81018255.js" type="text/javascript"></script>
      
      <meta http-equiv="x-pjax-version" content="0741c61298bb1b3e07c83e272155021d">

        <link data-pjax-transient rel='permalink' href='/powmedia/backbone-forms/blob/b1d90a5c1decaeeafe523037806fc61f780c3b8a/distribution.amd/editors/list.min.js'>
  <meta property="og:title" content="backbone-forms"/>
  <meta property="og:type" content="githubog:gitrepository"/>
  <meta property="og:url" content="https://github.com/powmedia/backbone-forms"/>
  <meta property="og:image" content="https://github.global.ssl.fastly.net/images/gravatars/gravatar-user-420.png"/>
  <meta property="og:site_name" content="GitHub"/>
  <meta property="og:description" content="backbone-forms - Form framework for BackboneJS with nested forms, editable lists and validation"/>

  <meta name="description" content="backbone-forms - Form framework for BackboneJS with nested forms, editable lists and validation" />

  <meta content="347176" name="octolytics-dimension-user_id" /><meta content="powmedia" name="octolytics-dimension-user_login" /><meta content="2341343" name="octolytics-dimension-repository_id" /><meta content="powmedia/backbone-forms" name="octolytics-dimension-repository_nwo" /><meta content="true" name="octolytics-dimension-repository_public" /><meta content="false" name="octolytics-dimension-repository_is_fork" /><meta content="2341343" name="octolytics-dimension-repository_network_root_id" /><meta content="powmedia/backbone-forms" name="octolytics-dimension-repository_network_root_nwo" />
  <link href="https://github.com/powmedia/backbone-forms/commits/master.atom" rel="alternate" title="Recent Commits to backbone-forms:master" type="application/atom+xml" />

  </head>


  <body class="logged_in  env-production macintosh vis-public page-blob">
    <div class="wrapper">
      
      
      
      


      <div class="header header-logged-in true">
  <div class="container clearfix">

    <a class="header-logo-invertocat" href="https://github.com/">
  <span class="mega-octicon octicon-mark-github"></span>
</a>

    
    <a href="/notifications" class="notification-indicator tooltipped downwards" data-gotokey="n" title="You have no unread notifications">
        <span class="mail-status all-read"></span>
</a>

      <div class="command-bar js-command-bar  in-repository">
          <form accept-charset="UTF-8" action="/search" class="command-bar-form" id="top_search_form" method="get">

<input type="text" data-hotkey=" s" name="q" id="js-command-bar-field" placeholder="Search or type a command" tabindex="1" autocapitalize="off"
    
    data-username="mateogo"
      data-repo="powmedia/backbone-forms"
      data-branch="master"
      data-sha="c5e27ea58456faf095daf9e18e9f391bb8f6c094"
  >

    <input type="hidden" name="nwo" value="powmedia/backbone-forms" />

    <div class="select-menu js-menu-container js-select-menu search-context-select-menu">
      <span class="minibutton select-menu-button js-menu-target">
        <span class="js-select-button">This repository</span>
      </span>

      <div class="select-menu-modal-holder js-menu-content js-navigation-container">
        <div class="select-menu-modal">

          <div class="select-menu-item js-navigation-item js-this-repository-navigation-item selected">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" class="js-search-this-repository" name="search_target" value="repository" checked="checked" />
            <div class="select-menu-item-text js-select-button-text">This repository</div>
          </div> <!-- /.select-menu-item -->

          <div class="select-menu-item js-navigation-item js-all-repositories-navigation-item">
            <span class="select-menu-item-icon octicon octicon-check"></span>
            <input type="radio" name="search_target" value="global" />
            <div class="select-menu-item-text js-select-button-text">All repositories</div>
          </div> <!-- /.select-menu-item -->

        </div>
      </div>
    </div>

  <span class="octicon help tooltipped downwards" title="Show command bar help">
    <span class="octicon octicon-question"></span>
  </span>


  <input type="hidden" name="ref" value="cmdform">

</form>
        <ul class="top-nav">
          <li class="explore"><a href="/explore">Explore</a></li>
            <li><a href="https://gist.github.com">Gist</a></li>
            <li><a href="/blog">Blog</a></li>
          <li><a href="https://help.github.com">Help</a></li>
        </ul>
      </div>

    


  <ul id="user-links">
    <li>
      <a href="/mateogo" class="name">
        <img height="20" src="https://0.gravatar.com/avatar/d5244528d68aea88930fb5b04d0d736f?d=https%3A%2F%2Fidenticons.github.com%2F4ff94d7b07a89b90fe6da9d3765d51f6.png&amp;r=x&amp;s=140" width="20" /> mateogo
      </a>
    </li>

      <li>
        <a href="/new" id="new_repo" class="tooltipped downwards" title="Create a new repo" aria-label="Create a new repo">
          <span class="octicon octicon-repo-create"></span>
        </a>
      </li>

      <li>
        <a href="/settings/profile" id="account_settings"
          class="tooltipped downwards"
          aria-label="Account settings "
          title="Account settings ">
          <span class="octicon octicon-tools"></span>
        </a>
      </li>
      <li>
        <a class="tooltipped downwards" href="/logout" data-method="post" id="logout" title="Sign out" aria-label="Sign out">
          <span class="octicon octicon-log-out"></span>
        </a>
      </li>

  </ul>

<div class="js-new-dropdown-contents hidden">
  

<ul class="dropdown-menu">
  <li>
    <a href="/new"><span class="octicon octicon-repo-create"></span> New repository</a>
  </li>
  <li>
    <a href="/organizations/new"><span class="octicon octicon-organization"></span> New organization</a>
  </li>



    <li class="section-title">
      <span title="powmedia/backbone-forms">This repository</span>
    </li>
      <li>
        <a href="/powmedia/backbone-forms/issues/new"><span class="octicon octicon-issue-opened"></span> New issue</a>
      </li>
</ul>

</div>


    
  </div>
</div>

      

      




          <div class="site" itemscope itemtype="http://schema.org/WebPage">
    
    <div class="pagehead repohead instapaper_ignore readability-menu">
      <div class="container">
        

<ul class="pagehead-actions">

    <li class="subscription">
      <form accept-charset="UTF-8" action="/notifications/subscribe" class="js-social-container" data-autosubmit="true" data-remote="true" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="VCTqMzSWK44650fR8PxX2g0ypRayCrhirfuAbAo4Bs8=" /></div>  <input id="repository_id" name="repository_id" type="hidden" value="2341343" />

    <div class="select-menu js-menu-container js-select-menu">
      <a class="social-count js-social-count" href="/powmedia/backbone-forms/watchers">
        102
      </a>
      <span class="minibutton select-menu-button with-count js-menu-target" role="button" tabindex="0">
        <span class="js-select-button">
          <span class="octicon octicon-eye-watch"></span>
          Watch
        </span>
      </span>

      <div class="select-menu-modal-holder">
        <div class="select-menu-modal subscription-menu-modal js-menu-content">
          <div class="select-menu-header">
            <span class="select-menu-title">Notification status</span>
            <span class="octicon octicon-remove-close js-menu-close"></span>
          </div> <!-- /.select-menu-header -->

          <div class="select-menu-list js-navigation-container" role="menu">

            <div class="select-menu-item js-navigation-item selected" role="menuitem" tabindex="0">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input checked="checked" id="do_included" name="do" type="radio" value="included" />
                <h4>Not watching</h4>
                <span class="description">You only receive notifications for conversations in which you participate or are @mentioned.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye-watch"></span>
                  Watch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
              <span class="select-menu-item-icon octicon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_subscribed" name="do" type="radio" value="subscribed" />
                <h4>Watching</h4>
                <span class="description">You receive notifications for all conversations in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-eye-unwatch"></span>
                  Unwatch
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

            <div class="select-menu-item js-navigation-item " role="menuitem" tabindex="0">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <div class="select-menu-item-text">
                <input id="do_ignore" name="do" type="radio" value="ignore" />
                <h4>Ignoring</h4>
                <span class="description">You do not receive any notifications for conversations in this repository.</span>
                <span class="js-select-button-text hidden-select-button-text">
                  <span class="octicon octicon-mute"></span>
                  Stop ignoring
                </span>
              </div>
            </div> <!-- /.select-menu-item -->

          </div> <!-- /.select-menu-list -->

        </div> <!-- /.select-menu-modal -->
      </div> <!-- /.select-menu-modal-holder -->
    </div> <!-- /.select-menu -->

</form>
    </li>

  <li>
  

  <div class="js-toggler-container js-social-container starring-container ">
    <a href="/powmedia/backbone-forms/unstar"
      class="minibutton with-count js-toggler-target star-button starred upwards"
      title="Unstar this repository" data-remote="true" data-method="post" rel="nofollow">
      <span class="octicon octicon-star-delete"></span><span class="text">Unstar</span>
    </a>

    <a href="/powmedia/backbone-forms/star"
      class="minibutton with-count js-toggler-target star-button unstarred upwards"
      title="Star this repository" data-remote="true" data-method="post" rel="nofollow">
      <span class="octicon octicon-star"></span><span class="text">Star</span>
    </a>

      <a class="social-count js-social-count" href="/powmedia/backbone-forms/stargazers">
        1,584
      </a>
  </div>

  </li>


        <li>
          <a href="/powmedia/backbone-forms/fork" class="minibutton with-count js-toggler-target fork-button lighter upwards" title="Fork this repo" rel="nofollow" data-method="post">
            <span class="octicon octicon-git-branch-create"></span><span class="text">Fork</span>
          </a>
          <a href="/powmedia/backbone-forms/network" class="social-count">321</a>
        </li>


</ul>

        <h1 itemscope itemtype="http://data-vocabulary.org/Breadcrumb" class="entry-title public">
          <span class="repo-label"><span>public</span></span>
          <span class="mega-octicon octicon-repo"></span>
          <span class="author">
            <a href="/powmedia" class="url fn" itemprop="url" rel="author"><span itemprop="title">powmedia</span></a>
          </span>
          <span class="repohead-name-divider">/</span>
          <strong><a href="/powmedia/backbone-forms" class="js-current-repository js-repo-home-link">backbone-forms</a></strong>

          <span class="page-context-loader">
            <img alt="Octocat-spinner-32" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
          </span>

        </h1>
      </div><!-- /.container -->
    </div><!-- /.repohead -->

    

    <div class="container">

      <div class="repository-with-sidebar repo-container  ">

        <div class="repository-sidebar">
            

<div class="sunken-menu vertical-right repo-nav js-repo-nav js-repository-container-pjax js-octicon-loaders">
  <div class="sunken-menu-contents">
    <ul class="sunken-menu-group">
      <li class="tooltipped leftwards" title="Code">
        <a href="/powmedia/backbone-forms" aria-label="Code" class="selected js-selected-navigation-item sunken-menu-item" data-gotokey="c" data-pjax="true" data-selected-links="repo_source repo_downloads repo_commits repo_tags repo_branches /powmedia/backbone-forms">
          <span class="octicon octicon-code"></span> <span class="full-word">Code</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

        <li class="tooltipped leftwards" title="Issues">
          <a href="/powmedia/backbone-forms/issues" aria-label="Issues" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-gotokey="i" data-selected-links="repo_issues /powmedia/backbone-forms/issues">
            <span class="octicon octicon-issue-opened"></span> <span class="full-word">Issues</span>
            <span class='counter'>104</span>
            <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>        </li>

      <li class="tooltipped leftwards" title="Pull Requests"><a href="/powmedia/backbone-forms/pulls" aria-label="Pull Requests" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-gotokey="p" data-selected-links="repo_pulls /powmedia/backbone-forms/pulls">
            <span class="octicon octicon-git-pull-request"></span> <span class="full-word">Pull Requests</span>
            <span class='counter'>34</span>
            <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>


        <li class="tooltipped leftwards" title="Wiki">
          <a href="/powmedia/backbone-forms/wiki" aria-label="Wiki" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="repo_wiki /powmedia/backbone-forms/wiki">
            <span class="octicon octicon-book"></span> <span class="full-word">Wiki</span>
            <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>        </li>
    </ul>
    <div class="sunken-menu-separator"></div>
    <ul class="sunken-menu-group">

      <li class="tooltipped leftwards" title="Pulse">
        <a href="/powmedia/backbone-forms/pulse" aria-label="Pulse" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="pulse /powmedia/backbone-forms/pulse">
          <span class="octicon octicon-pulse"></span> <span class="full-word">Pulse</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

      <li class="tooltipped leftwards" title="Graphs">
        <a href="/powmedia/backbone-forms/graphs" aria-label="Graphs" class="js-selected-navigation-item sunken-menu-item" data-pjax="true" data-selected-links="repo_graphs repo_contributors /powmedia/backbone-forms/graphs">
          <span class="octicon octicon-graph"></span> <span class="full-word">Graphs</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>

      <li class="tooltipped leftwards" title="Network">
        <a href="/powmedia/backbone-forms/network" aria-label="Network" class="js-selected-navigation-item sunken-menu-item js-disable-pjax" data-selected-links="repo_network /powmedia/backbone-forms/network">
          <span class="octicon octicon-git-branch"></span> <span class="full-word">Network</span>
          <img alt="Octocat-spinner-32" class="mini-loader" height="16" src="https://github.global.ssl.fastly.net/images/spinners/octocat-spinner-32.gif" width="16" />
</a>      </li>
    </ul>


  </div>
</div>

            <div class="only-with-full-nav">
              

  

<div class="clone-url open"
  data-protocol-type="http"
  data-url="/users/set_protocol?protocol_selector=http&amp;protocol_type=clone">
  <h3><strong>HTTPS</strong> clone URL</h3>
  <div class="clone-url-box">
    <input type="text" class="clone js-url-field"
           value="https://github.com/powmedia/backbone-forms.git" readonly="readonly">

    <span class="js-zeroclipboard url-box-clippy minibutton zeroclipboard-button" data-clipboard-text="https://github.com/powmedia/backbone-forms.git" data-copied-hint="copied!" title="copy to clipboard"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>

  

<div class="clone-url "
  data-protocol-type="ssh"
  data-url="/users/set_protocol?protocol_selector=ssh&amp;protocol_type=clone">
  <h3><strong>SSH</strong> clone URL</h3>
  <div class="clone-url-box">
    <input type="text" class="clone js-url-field"
           value="git@github.com:powmedia/backbone-forms.git" readonly="readonly">

    <span class="js-zeroclipboard url-box-clippy minibutton zeroclipboard-button" data-clipboard-text="git@github.com:powmedia/backbone-forms.git" data-copied-hint="copied!" title="copy to clipboard"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>

  

<div class="clone-url "
  data-protocol-type="subversion"
  data-url="/users/set_protocol?protocol_selector=subversion&amp;protocol_type=clone">
  <h3><strong>Subversion</strong> checkout URL</h3>
  <div class="clone-url-box">
    <input type="text" class="clone js-url-field"
           value="https://github.com/powmedia/backbone-forms" readonly="readonly">

    <span class="js-zeroclipboard url-box-clippy minibutton zeroclipboard-button" data-clipboard-text="https://github.com/powmedia/backbone-forms" data-copied-hint="copied!" title="copy to clipboard"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>


<p class="clone-options">You can clone with
      <a href="#" class="js-clone-selector" data-protocol="http">HTTPS</a>,
      <a href="#" class="js-clone-selector" data-protocol="ssh">SSH</a>,
      or <a href="#" class="js-clone-selector" data-protocol="subversion">Subversion</a>.
  <span class="octicon help tooltipped upwards" title="Get help on which URL is right for you.">
    <a href="https://help.github.com/articles/which-remote-url-should-i-use">
    <span class="octicon octicon-question"></span>
    </a>
  </span>
</p>

  <a href="http://mac.github.com" data-url="github-mac://openRepo/https://github.com/powmedia/backbone-forms" class="minibutton sidebar-button js-conduit-rewrite-url">
    <span class="octicon octicon-device-desktop"></span>
    Clone in Desktop
  </a>


              <a href="/powmedia/backbone-forms/archive/master.zip"
                 class="minibutton sidebar-button"
                 title="Download this repository as a zip file"
                 rel="nofollow">
                <span class="octicon octicon-cloud-download"></span>
                Download ZIP
              </a>
            </div>
        </div><!-- /.repository-sidebar -->

        <div id="js-repo-pjax-container" class="repository-content context-loader-container" data-pjax-container>
          


<!-- blob contrib key: blob_contributors:v21:9a97acf58bd17121f570fb5148059dfc -->

<p title="This is a placeholder element" class="js-history-link-replace hidden"></p>

<a href="/powmedia/backbone-forms/find/master" data-pjax data-hotkey="t" class="js-show-file-finder" style="display:none">Show File Finder</a>

<div class="file-navigation">
  

<div class="select-menu js-menu-container js-select-menu" >
  <span class="minibutton select-menu-button js-menu-target" data-hotkey="w"
    data-master-branch="master"
    data-ref="master"
    role="button" aria-label="Switch branches or tags" tabindex="0">
    <span class="octicon octicon-git-branch"></span>
    <i>branch:</i>
    <span class="js-select-button">master</span>
  </span>

  <div class="select-menu-modal-holder js-menu-content js-navigation-container" data-pjax>

    <div class="select-menu-modal">
      <div class="select-menu-header">
        <span class="select-menu-title">Switch branches/tags</span>
        <span class="octicon octicon-remove-close js-menu-close"></span>
      </div> <!-- /.select-menu-header -->

      <div class="select-menu-filters">
        <div class="select-menu-text-filter">
          <input type="text" aria-label="Filter branches/tags" id="context-commitish-filter-field" class="js-filterable-field js-navigation-enable" placeholder="Filter branches/tags">
        </div>
        <div class="select-menu-tabs">
          <ul>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="branches" class="js-select-menu-tab">Branches</a>
            </li>
            <li class="select-menu-tab">
              <a href="#" data-tab-filter="tags" class="js-select-menu-tab">Tags</a>
            </li>
          </ul>
        </div><!-- /.select-menu-tabs -->
      </div><!-- /.select-menu-filters -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="branches">

        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item selected">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/blob/master/distribution.amd/editors/list.min.js"
                 data-name="master"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="master">master</a>
            </div> <!-- /.select-menu-item -->
        </div>

          <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

      <div class="select-menu-list select-menu-tab-bucket js-select-menu-tab-bucket" data-tab-filter="tags">
        <div data-filterable-for="context-commitish-filter-field" data-filterable-type="substring">


            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.14.0/distribution.amd/editors/list.min.js"
                 data-name="v0.14.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.14.0">v0.14.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.13.0/distribution.amd/editors/list.min.js"
                 data-name="v0.13.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.13.0">v0.13.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.12.0/distribution.amd/editors/list.min.js"
                 data-name="v0.12.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.12.0">v0.12.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.11.0/distribution.amd/editors/list.min.js"
                 data-name="v0.11.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.11.0">v0.11.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.10.0/distribution.amd/editors/list.min.js"
                 data-name="v0.10.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.10.0">v0.10.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.9.0/distribution.amd/editors/list.min.js"
                 data-name="v0.9.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.9.0">v0.9.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.7.2/distribution.amd/editors/list.min.js"
                 data-name="v0.7.2"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.7.2">v0.7.2</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.7.1/distribution.amd/editors/list.min.js"
                 data-name="v0.7.1"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.7.1">v0.7.1</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.7.0/distribution.amd/editors/list.min.js"
                 data-name="v0.7.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.7.0">v0.7.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.6.0/distribution.amd/editors/list.min.js"
                 data-name="v0.6.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.6.0">v0.6.0</a>
            </div> <!-- /.select-menu-item -->
            <div class="select-menu-item js-navigation-item ">
              <span class="select-menu-item-icon octicon octicon-check"></span>
              <a href="/powmedia/backbone-forms/tree/v0.5.0/distribution.amd/editors/list.min.js"
                 data-name="v0.5.0"
                 data-skip-pjax="true"
                 rel="nofollow"
                 class="js-navigation-open select-menu-item-text js-select-button-text css-truncate-target"
                 title="v0.5.0">v0.5.0</a>
            </div> <!-- /.select-menu-item -->
        </div>

        <div class="select-menu-no-results">Nothing to show</div>
      </div> <!-- /.select-menu-list -->

    </div> <!-- /.select-menu-modal -->
  </div> <!-- /.select-menu-modal-holder -->
</div> <!-- /.select-menu -->

  <div class="breadcrumb">
    <span class='repo-root js-repo-root'><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/powmedia/backbone-forms" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">backbone-forms</span></a></span></span><span class="separator"> / </span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/powmedia/backbone-forms/tree/master/distribution.amd" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">distribution.amd</span></a></span><span class="separator"> / </span><span itemscope="" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="/powmedia/backbone-forms/tree/master/distribution.amd/editors" data-branch="master" data-direction="back" data-pjax="true" itemscope="url"><span itemprop="title">editors</span></a></span><span class="separator"> / </span><strong class="final-path">list.min.js</strong> <span class="js-zeroclipboard minibutton zeroclipboard-button" data-clipboard-text="distribution.amd/editors/list.min.js" data-copied-hint="copied!" title="copy to clipboard"><span class="octicon octicon-clippy"></span></span>
  </div>
</div>



  <div class="commit file-history-tease">
    <img class="main-avatar" height="24" src="https://1.gravatar.com/avatar/529a6049c4ad4483dbc62add6da06e1a?d=https%3A%2F%2Fidenticons.github.com%2F6b68046389020611bcec0f52271e28b6.png&amp;r=x&amp;s=140" width="24" />
    <span class="author"><a href="/philfreo" rel="author">philfreo</a></span>
    <time class="js-relative-date" datetime="2013-11-16T00:05:19-08:00" title="2013-11-16 00:05:19">November 16, 2013</time>
    <div class="commit-title">
        <a href="/powmedia/backbone-forms/commit/d8f2a566e7abea2746fc320a3b61baa95b4bc73e" class="message" data-pjax="true" title="Build">Build</a>
    </div>

    <div class="participation">
      <p class="quickstat"><a href="#blob_contributors_box" rel="facebox"><strong>3</strong> contributors</a></p>
          <a class="avatar tooltipped downwards" title="powmedia" href="/powmedia/backbone-forms/commits/master/distribution.amd/editors/list.min.js?author=powmedia"><img height="20" src="https://2.gravatar.com/avatar/3226184b321c13e700117f79606a3c77?d=https%3A%2F%2Fidenticons.github.com%2F874572a15132cbf9172e33165278e02a.png&amp;r=x&amp;s=140" width="20" /></a>
    <a class="avatar tooltipped downwards" title="philfreo" href="/powmedia/backbone-forms/commits/master/distribution.amd/editors/list.min.js?author=philfreo"><img height="20" src="https://1.gravatar.com/avatar/529a6049c4ad4483dbc62add6da06e1a?d=https%3A%2F%2Fidenticons.github.com%2F6b68046389020611bcec0f52271e28b6.png&amp;r=x&amp;s=140" width="20" /></a>
    <a class="avatar tooltipped downwards" title="bpardee" href="/powmedia/backbone-forms/commits/master/distribution.amd/editors/list.min.js?author=bpardee"><img height="20" src="https://2.gravatar.com/avatar/420291e1b7d022cf4fe73023ab345672?d=https%3A%2F%2Fidenticons.github.com%2F3416a7e4aad2d300974822ec51683a2c.png&amp;r=x&amp;s=140" width="20" /></a>


    </div>
    <div id="blob_contributors_box" style="display:none">
      <h2 class="facebox-header">Users who have contributed to this file</h2>
      <ul class="facebox-user-list">
          <li class="facebox-user-list-item">
            <img height="24" src="https://2.gravatar.com/avatar/3226184b321c13e700117f79606a3c77?d=https%3A%2F%2Fidenticons.github.com%2F874572a15132cbf9172e33165278e02a.png&amp;r=x&amp;s=140" width="24" />
            <a href="/powmedia">powmedia</a>
          </li>
          <li class="facebox-user-list-item">
            <img height="24" src="https://1.gravatar.com/avatar/529a6049c4ad4483dbc62add6da06e1a?d=https%3A%2F%2Fidenticons.github.com%2F6b68046389020611bcec0f52271e28b6.png&amp;r=x&amp;s=140" width="24" />
            <a href="/philfreo">philfreo</a>
          </li>
          <li class="facebox-user-list-item">
            <img height="24" src="https://2.gravatar.com/avatar/420291e1b7d022cf4fe73023ab345672?d=https%3A%2F%2Fidenticons.github.com%2F3416a7e4aad2d300974822ec51683a2c.png&amp;r=x&amp;s=140" width="24" />
            <a href="/bpardee">bpardee</a>
          </li>
      </ul>
    </div>
  </div>

<div id="files" class="bubble">
  <div class="file">
    <div class="meta">
      <div class="info">
        <span class="icon"><b class="octicon octicon-file-text"></b></span>
        <span class="mode" title="File Mode">file</span>
          <span>1 lines (1 sloc)</span>
        <span>7.689 kb</span>
      </div>
      <div class="actions">
        <div class="button-group">
            <a class="minibutton tooltipped leftwards js-conduit-openfile-check"
               href="http://mac.github.com"
               data-url="github-mac://openRepo/https://github.com/powmedia/backbone-forms?branch=master&amp;filepath=distribution.amd%2Feditors%2Flist.min.js"
               title="Open this file in GitHub for Mac"
               data-failed-title="Your version of GitHub for Mac is too old to open this file. Try checking for updates.">
                <span class="octicon octicon-device-desktop"></span> Open
            </a>
                <a class="minibutton tooltipped upwards"
                   title="Clicking this button will automatically fork this project so you can edit the file"
                   href="/powmedia/backbone-forms/edit/master/distribution.amd/editors/list.min.js"
                   data-method="post" rel="nofollow">Edit</a>
          <a href="/powmedia/backbone-forms/raw/master/distribution.amd/editors/list.min.js" class="button minibutton " id="raw-url">Raw</a>
            <a href="/powmedia/backbone-forms/blame/master/distribution.amd/editors/list.min.js" class="button minibutton ">Blame</a>
          <a href="/powmedia/backbone-forms/commits/master/distribution.amd/editors/list.min.js" class="button minibutton " rel="nofollow">History</a>
        </div><!-- /.button-group -->
          <a class="minibutton danger empty-icon tooltipped downwards"
             href="/powmedia/backbone-forms/delete/master/distribution.amd/editors/list.min.js"
             title="Fork this project and delete file"
             data-method="post" data-test-id="delete-blob-file" rel="nofollow">
          Delete
        </a>
      </div><!-- /.actions -->

    </div>
        <div class="blob-wrapper data type-javascript js-blob-data">
        <table class="file-code file-diff">
          <tr class="file-code-line">
            <td class="blob-line-nums">
              <span id="L1" rel="#L1">1</span>

            </td>
            <td class="blob-line-code">
                  <div class='line' id='LC1'>define([&quot;jquery&quot;,&quot;underscore&quot;,&quot;backbone&quot;,&quot;backbone-forms&quot;],function(e,t,n){(function(r){r.editors.List=r.editors.Base.extend({events:{&#39;click [data-action=&quot;add&quot;]&#39;:function(e){e.preventDefault(),this.addItem(null,!0)}},initialize:function(e){e=e||{};var t=r.editors;t.Base.prototype.initialize.call(this,e);var n=this.schema;if(!n)throw new Error(&quot;Missing required option &#39;schema&#39;&quot;);this.template=e.template||this.constructor.template,this.Editor=function(){var e=n.itemType;return e?t.List[e]?t.List[e]:t[e]:t.Text}(),this.items=[]},render:function(){var n=this,r=this.value||[],i=e(e.trim(this.template()));return this.$list=i.is(&quot;[data-items]&quot;)?i:i.find(&quot;[data-items]&quot;),r.length?t.each(r,function(e){n.addItem(e)}):this.Editor.isAsync||this.addItem(),this.setElement(i),this.$el.attr(&quot;id&quot;,this.id),this.$el.attr(&quot;name&quot;,this.key),this.hasFocus&amp;&amp;this.trigger(&quot;blur&quot;,this),this},addItem:function(e,n){var i=this,s=r.editors,o=(new s.List.Item({list:this,form:this.form,schema:this.schema,value:e,Editor:this.Editor,key:this.key})).render(),u=function(){i.items.push(o),i.$list.append(o.el),o.editor.on(&quot;all&quot;,function(e){if(e===&quot;change&quot;)return;var n=t.toArray(arguments);n[0]=&quot;item:&quot;+e,n.splice(1,0,i),s.List.prototype.trigger.apply(this,n)},i),o.editor.on(&quot;change&quot;,function(){o.addEventTriggered||(o.addEventTriggered=!0,this.trigger(&quot;add&quot;,this,o.editor)),this.trigger(&quot;item:change&quot;,this,o.editor),this.trigger(&quot;change&quot;,this)},i),o.editor.on(&quot;focus&quot;,function(){if(this.hasFocus)return;this.trigger(&quot;focus&quot;,this)},i),o.editor.on(&quot;blur&quot;,function(){if(!this.hasFocus)return;var e=this;setTimeout(function(){if(t.find(e.items,function(e){return e.editor.hasFocus}))return;e.trigger(&quot;blur&quot;,e)},0)},i);if(n||e)o.addEventTriggered=!0;n&amp;&amp;(i.trigger(&quot;add&quot;,i,o.editor),i.trigger(&quot;change&quot;,i))};return this.Editor.isAsync?o.editor.on(&quot;readyToAdd&quot;,u,this):(u(),o.editor.focus()),o},removeItem:function(e){var n=this.schema.confirmDelete;if(n&amp;&amp;!confirm(n))return;var r=t.indexOf(this.items,e);this.items[r].remove(),this.items.splice(r,1),e.addEventTriggered&amp;&amp;(this.trigger(&quot;remove&quot;,this,e.editor),this.trigger(&quot;change&quot;,this)),!this.items.length&amp;&amp;!this.Editor.isAsync&amp;&amp;this.addItem()},getValue:function(){var e=t.map(this.items,function(e){return e.getValue()});return t.without(e,undefined,&quot;&quot;)},setValue:function(e){this.value=e,this.render()},focus:function(){if(this.hasFocus)return;this.items[0]&amp;&amp;this.items[0].editor.focus()},blur:function(){if(!this.hasFocus)return;var e=t.find(this.items,function(e){return e.editor.hasFocus});e&amp;&amp;e.editor.blur()},remove:function(){t.invoke(this.items,&quot;remove&quot;),r.editors.Base.prototype.remove.call(this)},validate:function(){if(!this.validators)return null;var e=t.map(this.items,function(e){return e.validate()}),n=t.compact(e).length?!0:!1;if(!n)return null;var r={type:&quot;list&quot;,message:&quot;Some of the items in the list failed validation&quot;,errors:e};return r}},{template:t.template(&#39;      &lt;div&gt;        &lt;div data-items&gt;&lt;/div&gt;        &lt;button type=&quot;button&quot; data-action=&quot;add&quot;&gt;Add&lt;/button&gt;      &lt;/div&gt;    &#39;,null,r.templateSettings)}),r.editors.List.Item=r.editors.Base.extend({events:{&#39;click [data-action=&quot;remove&quot;]&#39;:function(e){e.preventDefault(),this.list.removeItem(this)},&quot;keydown input[type=text]&quot;:function(e){if(e.keyCode!==13)return;e.preventDefault(),this.list.addItem(),this.list.$list.find(&quot;&gt; li:last input&quot;).focus()}},initialize:function(e){this.list=e.list,this.schema=e.schema||this.list.schema,this.value=e.value,this.Editor=e.Editor||r.editors.Text,this.key=e.key,this.template=e.template||this.schema.itemTemplate||this.constructor.template,this.errorClassName=e.errorClassName||this.constructor.errorClassName,this.form=e.form},render:function(){this.editor=(new this.Editor({key:this.key,schema:this.schema,value:this.value,list:this.list,item:this,form:this.form})).render();var t=e(e.trim(this.template()));return t.find(&quot;[data-editor]&quot;).append(this.editor.el),this.setElement(t),this},getValue:function(){return this.editor.getValue()},setValue:function(e){this.editor.setValue(e)},focus:function(){this.editor.focus()},blur:function(){this.editor.blur()},remove:function(){this.editor.remove(),n.View.prototype.remove.call(this)},validate:function(){var e=this.getValue(),n=this.list.form?this.list.form.getValue():{},r=this.schema.validators,i=this.getValidator;if(!r)return null;var s=null;return t.every(r,function(t){return s=i(t)(e,n),s?!1:!0}),s?this.setError(s):this.clearError(),s?s:null},setError:function(e){this.$el.addClass(this.errorClassName),this.$el.attr(&quot;title&quot;,e.message)},clearError:function(){this.$el.removeClass(this.errorClassName),this.$el.attr(&quot;title&quot;,null)}},{template:t.template(&#39;      &lt;div&gt;        &lt;span data-editor&gt;&lt;/span&gt;        &lt;button type=&quot;button&quot; data-action=&quot;remove&quot;&gt;&amp;times;&lt;/button&gt;      &lt;/div&gt;    &#39;,null,r.templateSettings),errorClassName:&quot;error&quot;}),r.editors.List.Modal=r.editors.Base.extend({events:{click:&quot;openEditor&quot;},initialize:function(e){e=e||{},r.editors.Base.prototype.initialize.call(this,e);if(!r.editors.List.Modal.ModalAdapter)throw new Error(&quot;A ModalAdapter is required&quot;);this.form=e.form;if(!e.form)throw new Error(&#39;Missing required option: &quot;form&quot;&#39;);this.template=e.template||this.constructor.template},render:function(){var e=this;return t.isEmpty(this.value)?this.openEditor():(this.renderSummary(),setTimeout(function(){e.trigger(&quot;readyToAdd&quot;)},0)),this.hasFocus&amp;&amp;this.trigger(&quot;blur&quot;,this),this},renderSummary:function(){this.$el.html(e.trim(this.template({summary:this.getStringValue()})))},itemToString:function(e){var n=function(e){var t={key:e};return r.Field.prototype.createTitle.call(t)};e=e||{};var i=[];return t.each(this.nestedSchema,function(r,s){var o=r.title?r.title:n(s),u=e[s];if(t.isUndefined(u)||t.isNull(u))u=&quot;&quot;;i.push(o+&quot;: &quot;+u)}),i.join(&quot;&lt;br /&gt;&quot;)},getStringValue:function(){var e=this.schema,n=this.getValue();return t.isEmpty(n)?&quot;[Empty]&quot;:e.itemToString?e.itemToString(n):this.itemToString(n)},openEditor:function(){var e=this,n=this.form.constructor,i=this.modalForm=new n({schema:this.nestedSchema,data:this.value}),s=this.modal=new r.editors.List.Modal.ModalAdapter({content:i,animate:!0});s.open(),this.trigger(&quot;open&quot;,this),this.trigger(&quot;focus&quot;,this),s.on(&quot;cancel&quot;,this.onModalClosed,this),s.on(&quot;ok&quot;,t.bind(this.onModalSubmitted,this))},onModalSubmitted:function(){var e=this.modal,t=this.modalForm,n=!this.value,r=t.validate();if(r)return e.preventClose();this.value=t.getValue(),this.renderSummary(),n&amp;&amp;this.trigger(&quot;readyToAdd&quot;),this.trigger(&quot;change&quot;,this),this.onModalClosed()},onModalClosed:function(){this.modal=null,this.modalForm=null,this.trigger(&quot;close&quot;,this),this.trigger(&quot;blur&quot;,this)},getValue:function(){return this.value},setValue:function(e){this.value=e},focus:function(){if(this.hasFocus)return;this.openEditor()},blur:function(){if(!this.hasFocus)return;this.modal&amp;&amp;this.modal.trigger(&quot;cancel&quot;)}},{template:t.template(&quot;      &lt;div&gt;&lt;%= summary %&gt;&lt;/div&gt;    &quot;,null,r.templateSettings),ModalAdapter:n.BootstrapModal,isAsync:!0}),r.editors.List.Object=r.editors.List.Modal.extend({initialize:function(){r.editors.List.Modal.prototype.initialize.apply(this,arguments);var e=this.schema;if(!e.subSchema)throw new Error(&#39;Missing required option &quot;schema.subSchema&quot;&#39;);this.nestedSchema=e.subSchema}}),r.editors.List.NestedModel=r.editors.List.Modal.extend({initialize:function(){r.editors.List.Modal.prototype.initialize.apply(this,arguments);var e=this.schema;if(!e.model)throw new Error(&#39;Missing required option &quot;schema.model&quot;&#39;);var n=e.model.prototype.schema;this.nestedSchema=t.isFunction(n)?n():n},getStringValue:function(){var e=this.schema,n=this.getValue();return t.isEmpty(n)?null:e.itemToString?e.itemToString(n):(new e.model(n)).toString()}})})(n.Form)})</div>
            </td>
          </tr>
        </table>
  </div>

  </div>
</div>

<a href="#jump-to-line" rel="facebox[.linejump]" data-hotkey="l" class="js-jump-to-line" style="display:none">Jump to Line</a>
<div id="jump-to-line" style="display:none">
  <form accept-charset="UTF-8" class="js-jump-to-line-form">
    <input class="linejump-input js-jump-to-line-field" type="text" placeholder="Jump to line&hellip;" autofocus>
    <button type="submit" class="button">Go</button>
  </form>
</div>

        </div>

      </div><!-- /.repo-container -->
      <div class="modal-backdrop"></div>
    </div><!-- /.container -->
  </div><!-- /.site -->


    </div><!-- /.wrapper -->

      <div class="container">
  <div class="site-footer">
    <ul class="site-footer-links right">
      <li><a href="https://status.github.com/">Status</a></li>
      <li><a href="http://developer.github.com">API</a></li>
      <li><a href="http://training.github.com">Training</a></li>
      <li><a href="http://shop.github.com">Shop</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/about">About</a></li>

    </ul>

    <a href="/">
      <span class="mega-octicon octicon-mark-github"></span>
    </a>

    <ul class="site-footer-links">
      <li>&copy; 2013 <span title="0.05617s from github-fe121-cp1-prd.iad.github.net">GitHub</span>, Inc.</li>
        <li><a href="/site/terms">Terms</a></li>
        <li><a href="/site/privacy">Privacy</a></li>
        <li><a href="/security">Security</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
  </div><!-- /.site-footer -->
</div><!-- /.container -->


    <div class="fullscreen-overlay js-fullscreen-overlay" id="fullscreen_overlay">
  <div class="fullscreen-container js-fullscreen-container">
    <div class="textarea-wrap">
      <textarea name="fullscreen-contents" id="fullscreen-contents" class="js-fullscreen-contents" placeholder="" data-suggester="fullscreen_suggester"></textarea>
          <div class="suggester-container">
              <div class="suggester fullscreen-suggester js-navigation-container" id="fullscreen_suggester"
                 data-url="/powmedia/backbone-forms/suggestions/commit">
              </div>
          </div>
    </div>
  </div>
  <div class="fullscreen-sidebar">
    <a href="#" class="exit-fullscreen js-exit-fullscreen tooltipped leftwards" title="Exit Zen Mode">
      <span class="mega-octicon octicon-screen-normal"></span>
    </a>
    <a href="#" class="theme-switcher js-theme-switcher tooltipped leftwards"
      title="Switch themes">
      <span class="octicon octicon-color-mode"></span>
    </a>
  </div>
</div>



    <div id="ajax-error-message" class="flash flash-error">
      <span class="octicon octicon-alert"></span>
      <a href="#" class="octicon octicon-remove-close close ajax-error-dismiss"></a>
      Something went wrong with that request. Please try again.
    </div>

  </body>
</html>

