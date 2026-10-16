# Инструкция по локальной установке и тестированию Myna Quick Note

Данная инструкция описывает процесс установки расширения GNOME Shell `myna-quick-note` в локальное окружение для разработки и тестирования в Ubuntu 26.04.

## 1. Установка (Симлинк)
Для того чтобы GNOME Shell подхватил расширение, создайте символическую ссылку на директорию проекта в папке пользовательских расширений GNOME:

```bash
mkdir -p ~/.local/share/gnome-shell/extensions
ln -s $(pwd) ~/.local/share/gnome-shell/extensions/myna-quick-note@diserere.github.com
```

## 2. Активация расширения
Перезапустите GNOME Shell (в Wayland перезайдите в систему, на X11 нажмите `Alt+F2`, введите `r` и нажмите Enter).

Затем включите расширение через консоль:
```bash
gnome-extensions enable myna-quick-note@diserere.github.com
```

## 3. Проверка логов
Чтобы убедиться, что расширение успешно загрузилось и активировалось, проверьте логи системного журнала:
```bash
journalctl -f -o cat /usr/bin/gnome-shell
```
Ожидаемый вывод: `[Myna Quick Note] Расширение активировано`.
