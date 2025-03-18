import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import localeUz from '@angular/common/locales/uz-Cyrl';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeUzExtra from '@angular/common/locales/extra/uz-Cyrl';


// @ts-ignore
import ruData from '../../i18n/ru.json';

// @ts-ignore
import uzData from '../../i18n/uz.json';

import { KeyItem } from './models/common.models';

export function extract(s: string) {
  return s;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizeService {
  private defaultLang: string = 'uz';
  private langs: string[] = ['uz', 'ru'];
  private langDic: { [key: string]: string } = {
    uz: `Oʻz`,
    ru: 'Ру'
  };
  private langPattern: any = /uz|ru/;
  private storageKey = 'language';

  constructor(private translate: TranslateService) {}

  initializeConfig() {
    this.translate.addLangs(this.langs);
    this.translate.setDefaultLang(this.defaultLang);
    //storage
    const localeLang = localStorage.getItem(this.storageKey);
    if (localeLang && localeLang.match(this.langPattern)) {
      this.changeLang(localeLang);
    } else {
      this.changeLang(this.defaultLang);
    }
  }

  changeLang(lang: string): void {
    //locale
    if (lang == this.langs[0]) {
      registerLocaleData(localeUz, lang, localeUzExtra);
      this.translate.setTranslation('uz', uzData);
    } else if (lang == this.langs[1]) {
      registerLocaleData(localeRu, lang, localeRuExtra);
      this.translate.setTranslation('ru', ruData);
    } 
    this.translate.use(lang);
    localStorage.setItem(this.storageKey, lang);
  }

  currentLang(): KeyItem {
    let id = this.getLangCode();
    return {
      key: id,
      value: this.langDic[id]
    };
  }

  getLangCode() {
    return this.translate.currentLang;
  }

  getLangs(): KeyItem[] {
    let langs: KeyItem[] = [];
    for (let item in this.langDic) {
      langs.push({
        key: item,
        value: this.langDic[item]
      });
    }
    return langs;
  }
}
