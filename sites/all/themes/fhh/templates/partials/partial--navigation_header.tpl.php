<header class="o-header js-header" role="banner">

  <div class="o-header__top">
    <div class="o-container o-container--header o-valign">
      <ul class="o-list o-list--horizontal c-menu--small o-float-l">
        <li><a href="https://www.hautehorlogerie.org/fr/" target="_blank" title="FHH" class="c-menu__link c-menu__link__outbound"><svg class="o-icon o-icon--outbound"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#outbound-left"></use></svg><span class="o-label o-label--brown">FHH</span></a></li>
        <li class="c-menu__item-lang"><a href="javascript://void(0);" class="c-menu__link c-menu__link__dropdown js-lang__dropdown">Français</a><ul class="c-lang--dropdown js-lang__dropdown-choices"><li><a href="https://journal.preprod.hautehorlogerie.org/en/" class="c-menu__link">Anglais</a></li></ul></li>      </ul>
      <ul class="o-list o-list--horizontal c-menu--small o-float-r">
        <li><a href="javascript://void(0);" title="Keep my Inbox Inspiring" class="c-menu__link js-nav--social__toggle">Restez informés</a></li>
        <li><a href="javascript://void(0);" title="Follow Us" class="c-menu__link js-nav--social__toggle">Suivez-nous</a></li>
      </ul>
      <div class="o-logo o-logo--header-top o-float-l" style="z-index: 1;">
                <a href="/fr?ref=fhh" title="HH Journal" class="js-hero__scroll"></a>
      </div><!-- /.o-logo -->
    </div>
  </div><!-- /.o-header__top -->

  <div class="o-header__main">
    <div class="o-container o-container--header o-valign">
      <a href="#" title="" class="o-icon o-icon--hamburger o-float-l js-burger-toggle">
        <span></span>
        <span></span>
        <span></span>
      </a><!-- /.o-icon -->

      <div class="o-logo o-float-l" style="z-index: 1;">
        <a href="/fr?ref=fhh" title="HH Journal" class="js-hero__scroll"></a>
      </div>

      <?php print partial('navigation_dropdown', array()); ?>

      <ul class="o-list o-list--horizontal o-list--border o-list--icons o-float-r">
        <li class="u-no-border u-no-padding account-name"><a href="javascript://void(0);" class="c-menu__link__account"><span class="o-label o-label--normal">Mon Compte</span></a></li>
        <li>
          <a href="javascript://void(0);" title="Bookmark" class="c-menu__link__account">
            <svg class="o-icon o-icon--bookmark"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bookmark"></use></svg>
          </a>
        </li>
        <li>
          <a class="openSearch" title="Search">
            <svg class="o-icon o-icon--search"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#search"></use></svg>
          </a>
        </li>
      </ul>

    </div><!-- /.o-container -->
  </div><!-- /.o-header__main -->

    <div id="homesnacks" class="o-header__bottom" data-snackable-bar></div>

  <div class="c-timeline js-timeline">
    <progress value="0" max="100" data-article-id="<?php // TODO ?>" class="o-progress c-timeline__progress js-timeline__progress"></progress>
  </div><!-- /.c-timeline -->

  <?php print partial('snackables', array()); ?>

<!-- Preload content share icons START-->
  <img src="/wp-content/themes/fhh/assets/images/icons/contentshare-fb.png" style="display:none; opacity: 0;">
  <img src="/wp-content/themes/fhh/assets/images/icons/contentshare-tw.png" style="display:none; opacity: 0;">
<!-- Preload content share icons END -->

</header><!-- /.header -->