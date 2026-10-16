import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

/**
 * Основной класс расширения Myna Quick Note.
 */
export default class MynaQuickNoteExtension extends Extension {
    /**
     * Вызывается при включении расширения.
     */
    enable() {
        console.log(`[${this.metadata.name}] Расширение активировано`);
    }

    /**
     * Вызывается при отключении расширения.
     */
    disable() {
        console.log(`[${this.metadata.name}] Расширение деактивировано`);
    }
}
