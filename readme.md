![](https://dynamicimagesfr-v2b.netdna-ssl.com/product_class_external_product/vue_js_128.png)

# Starter Kit (Vue2)

Car j'en avais marre de tout coller à chaque fois de projets en projets, de tout *re* configurer, tout ça, tout ça... Donc voici une base *propre*...

Les commandes
----
### Build
`npm run build`

Build et met tout dans le dossier... dist. Classique ! Gère la minification d'images avec *gulp-imagemin*, en revanche il faut ajouter manuellement une task pour les sprites svg.

### Dev
`npm run dev`

Lance [`gulp-connect`](https://github.com/avevlad/gulp-connect) sur le port :8080 avec livereload, watchify (vueify + babelify) pour le js, sass et pug, créé un dossier `temp` pour éviter de mettre le bordel dans dist
### Deploy
`npm run deploy`

Alors un peu capricieux *(mais rapide)*, parfois ça lance des erreurs alors que tout est bien uploadé sur le FTP, si c'est le cas il faut checker les permissions du dossier que le FTP vient de créer.

Utiliser le fichier `ftpconf.demo.yaml` pour la configuration, et le renommer en enlevant le *.demo* pour éviter de commit les infos ftp par erreur, * ça serait bête !*

### Test unitaire
`npm test`

Utilisation de Karma avec Browserify, et avec comme navigateur PhantomJS et Chrome. Les spec se trouvent dans le dossier test... Bref là aussi classique !

## Y'a quoi dedans ?
* Pug
* Sass (.sass) + Foundation
* Browserify
* Watchify
* vueify
* babelify (preset-es2015)
* Gulp
* Gulp Connect
* Imagemin
* Karma
    * jasmine
    * browserify
    * phantomjs
    * chrome
* lodash
* vinyl-ftp
* ora
* yamljs
