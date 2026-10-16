import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const MynaIndicator = GObject.registerClass(
class MynaIndicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, 'Myna Quick Note');

        let icon = new St.Icon({
            icon_name: 'text-editor-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(icon);
    }
});

/**
 * Основной класс расширения Myna Quick Note.
 */
export default class MynaQuickNoteExtension extends Extension {
    /**
     * Вызывается при включении расширения.
     */
    enable() {
        console.log(`[${this.metadata.name}] Расширение активировано`);

        // 1. Создаем индикатор на панели
        this._indicator = new MynaIndicator();

        // 2. Создаем контейнер диалога
        this._dialog = new St.BoxLayout({
            vertical: true,
            style_class: 'myna-quick-note-dialog',
            reactive: true,
            visible: false,
        });

        // Заголовок
        let titleLabel = new St.Label({
            text: 'Myna Quick Note',
            style_class: 'myna-quick-note-title',
        });
        this._dialog.add_child(titleLabel);

        // Поле ввода текста (St.Entry)
        this._entry = new St.Entry({
            hint_text: 'Введите или отредактируйте текст...',
            track_hover: true,
            can_focus: true,
            style_class: 'myna-quick-note-entry',
        });
        this._dialog.add_child(this._entry);

        // Подсказка
        let hintLabel = new St.Label({
            text: 'Нажмите Enter для копирования в буфер обмена',
            style_class: 'myna-quick-note-hint',
        });
        this._dialog.add_child(hintLabel);

        // Добавляем диалог в UI групп GNOME Shell
        Main.uiGroup.add_child(this._dialog);

        // Центрируем диалог на экране
        this._updateDialogPosition();

        // Обработка нажатия Enter в поле ввода
        this._entry.clutter_text.connect('key-press-event', (actor, event) => {
            let symbol = event.get_key_symbol();
            if (symbol === Clutter.KEY_Return || symbol === Clutter.KEY_Enter) {
                let text = this._entry.get_text();
                if (text && text.trim().length > 0) {
                    St.Clipboard.get_default().set_text(
                        St.ClipboardType.CLIPBOARD,
                        text
                    );
                    console.log(`[${this.metadata.name}] Текст скопирован в буфер обмена: ${text}`);
                }
                this._closeDialog();
                return Clutter.EVENT_STOP;
            } else if (symbol === Clutter.KEY_Escape) {
                this._closeDialog();
                return Clutter.EVENT_STOP;
            }
            return Clutter.EVENT_PROPAGATE;
        });

        // Клик по кнопке на панели переключает видимость диалога
        this._indicator.connect('button-press-event', () => {
            if (this._dialog.visible) {
                this._closeDialog();
            } else {
                this._openDialog();
            }
        });

        // Добавляем индикатор на верхнюю панель
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    _openDialog() {
        this._updateDialogPosition();
        this._dialog.show();
        global.stage.set_key_focus(this._entry);
    }

    _closeDialog() {
        this._entry.set_text('');
        this._dialog.hide();
    }

    _updateDialogPosition() {
        let monitor = Main.layoutManager.primaryMonitor;
        this._dialog.x = Math.floor(monitor.width / 2 - 200);
        this._dialog.y = Math.floor(monitor.height / 3);
        this._dialog.width = 400;
    }

    /**
     * Вызывается при отключении расширения.
     */
    disable() {
        if (this._dialog) {
            this._dialog.destroy();
            this._dialog = null;
        }
        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
        }
        this._entry = null;
        console.log(`[${this.metadata.name}] Расширение деактивировано`);
    }
}
