<div class="c-burger js-burger">
  <nav class="c-nav c-nav--burger" role="navigation">
    <!-- <ul id="menu-main-menu" class="c-menu o-list js-accordion">
      <li class=" has-subnav c-menu__item js-accordion__item">
        <a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/" class="c-menu__link" title="En continu">En continu</a>
        <ul class="o-list c-menu c-menu--sub clearfix js-accordion__content">
            <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/" class="c-menu__link" title="En continu">Tout voir</a></li>   
            <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/notre-selection-video/" class="c-menu__link" title="Notre sélection en vidéo">Notre sélection en vidéo</a></li>
            <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/nouveautes/" class="c-menu__link" title="Nouveautés">Nouveautés</a></li>
            <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/atelier-technique/" class="c-menu__link" title="Atelier technique">Atelier technique</a></li>
            <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/portraits-fr/" class="c-menu__link" title="Portraits">Portraits</a></li>
            <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/category/en-continu/visite-guidee/" class="c-menu__link" title="Visite guidée">Visite guidée</a></li>
        </ul>
      </li>
    </ul> -->  
    <!-- <ul id="menu-main-menu" class="c-menu o-list js-accordion">
      <li class="menu-495 first"><a href="http://drupal-fhh.dev/watch-list" title="">Watch List</a></li>
      <li class="menu-496"><a href="http://drupal-fhh.dev/market-insight" title="">Market Insight</a></li>
      <li class="menu-497"><a href="http://drupal-fhh.dev/point-of-view" title="">Point of View</a></li>
      <li class="menu-498"><a href="http://drupal-fhh.dev/events" title="">What's going on</a></li>
      <li class="menu-499"><a href="http://drupal-fhh.dev/the-life" title="">The Life</a></li>
      <li class="menu-500 last"><a href="http://drupal-fhh.dev/on-culture" title="">On Culture</a></li>
    </ul> -->
    <?php var_dump($main_menu); ?>
    <?php if ($main_menu): ?>
      <div id="main-menu" class="navigation">
        <?php print theme('links__system_main_menu', array(
          'links' => $main_menu,
          'attributes' => array(
            'id' => 'main-menu-links',
            'class' => array('links', 'clearfix'),
          ),
          'heading' => array(
            'text' => t('Main menu'),
            'level' => 'h2',
            'class' => array('element-invisible'),
          ),
        )); ?>
      </div> <!-- /#main-menu -->
    <?php endif; ?>
  </nav>

  <div class="c-burger__articles o-align-c">
    <div class="o-container o-container--header">
      <ul class="o-list o-list--horizontal o-list--border o-list--space-m o-align-c">
        <li class="c-menu__item">
          <a href="https://journal.preprod.hautehorlogerie.org/fr/short-stories" class="c-menu__link" alt="View all short stories"><span class="o-label">Voir toutes les brèves</span></a>
        </li>
        <li class="c-menu__item">
          <a href="https://journal.preprod.hautehorlogerie.org/fr/videos" class="c-menu__link" alt="View all video articles"><span class="o-label">Toutes les vidéos</span></a>
        </li>
      </ul>
    </div>
  </div><!-- /.c-burger__articles -->

  <div class="c-burger__util o-valign">
    <div class="c-block c-block--half"><a href="javascript://void(0);" title="FHH"><svg class="o-icon o-icon--outbound" style="margin-right: 10px"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#outbound-left"></use></svg><span class="o-label o-label--brown">FHH</span></a></div>
    <div class="c-block c-block--half"><ul class="o-list o-list--horizontal c-menu--small"><li class="c-menu__item-lang"><a href="javascript://void(0);" class="c-menu__link c-menu__link__burger js-lang__burger">Français</a><ul class="c-lang--burger js-lang__burger-choices"><li><a href="https://journal.preprod.hautehorlogerie.org/en/" class="c-menu__link">Anglais</a></li></ul></li></ul></div>
  </div><!-- /.c-burger__util -->

  <div class="c-burger__util o-valign">
    <ul class="o-list o-list--horizontal o-list--space-ss o-align-c is-mobile">
      <li>
        <a href="https://twitter.com/fondationhh" title="Twitter" target="_blank">
          <svg class="o-icon o-icon--twitter"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#twitter"></use></svg>
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/FondationHauteHorlogerie/" title="Facebook" target="_blank">
          <svg class="o-icon o-icon--facebook"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#facebook"></use></svg>
        </a>
      </li>
      <li>
        <a href="https://www.youtube.com/user/FondationHH" title="Youtube" target="_blank">
          <svg class="o-icon o-icon--youtube"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#youtube"></use></svg>
        </a>
      </li>
      <li>
        <a href="https://www.pinterest.com/FondationHH/" title="Pinterest" target="_blank">
          <svg class="o-icon o-icon--pinterest"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#pinterest"></use></svg>
        </a>
      </li>
      <li>
        <a href="https://www.instagram.com/fondationhh/" title="Instagram" target="_blank">
          <svg class="o-icon o-icon--instagram"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#instagram"></use></svg>
        </a>
      </li>
    </ul>
  </div><!-- /.c-burger__util -->

  <div class="c-burger__bottom clearfix">
    <div class="o-container o-container--header">
      <div class="c-burger__box c-burger__links o-float-r">
        <ul class="c-menu c-menu--small c-menu--links o-list o-list--line">
          <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/a-propos/" title="À propos" class="c-menu__link">À propos</a></li>
          <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/les-contributeurs/" title="Les contributeurs" class="c-menu__link">Les contributeurs</a></li>
          <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/contactez-nous/" title="Contactez nous" class="c-menu__link">Contactez nous</a></li>
          <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/mentions-legales/" title="Mentions légales" class="c-menu__link">Mentions légales</a></li>
          <li class="c-menu__item"><a href="https://journal.preprod.hautehorlogerie.org/fr/partenaires/" title="Partenaires" class="c-menu__link">Partenaires</a></li>
        </ul>      
      </div>

      <div class="c-burger__box c-burger__copy o-float-l">
        <p>© 2016 - Copyright Fondation de la Haute Horlogerie Tous droits réservés</p>
      </div>
    </div>
  </div><!-- /.c-dropdown__bottom -->

</div>