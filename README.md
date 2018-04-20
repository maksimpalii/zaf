# Loftschool сборка от Палий Максим Станиславович

> Сборка работает на gulp версии 4.0.

#### Для начала работы

1. ```clone this repo```
2. ```cd path/to/...```
3. ```npm install gulpjs/gulp-cli -g```
> Установка последней версии Gulp CLI tools глобально (подробнее - [GitHub](https://github.com/gulpjs/gulp/blob/4.0/docs/getting-started.md) )

4. ```npm install```
6. ```run gulp```

#### Изменения

1. ```добавлен плагин gulp.spritesmith для создания спрайтов```
2. ```создан task для генерация спрайтов *.png командой "gulp sprite:png" и спрайтов *.gif командой "gulp sprite:gif"```
3. ```добавлин task копирования шрифтов из папки с исходниками в папку для продакшена ( отдельная команда "gulp copy:font")```
4. ```добавленые tasks включены в task default и отслеживаються```