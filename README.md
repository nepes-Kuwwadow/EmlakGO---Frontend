# EmläkGO - Frontend

Türkmenistanyň döwrebap emläk portaly üçin Vue 3 + Tailwind CSS + Vite esasynda taýýarlanylan frontend programmasy. Bu frontend gös-göni **EmläkGO - backend** (Laravel REST API) bilen integrirlenen.

---

## Aýratynlyklary (Features)

- **Baş sahypa (Home)**:
  - Giň gözleg paneli (Şäher, Kategoriýa, Otag sany)
  - Kategoriýalar boýunça çalt geçişler
  - Iň täze emläk bildirişleri
  - Platformanyň amatlyklary we maglumatlary
- **Emläkler (Listings & Filter)**:
  - Döwrebap süzgüç (Şäher, Kategoriýa, Min/Max baha, Otag sany)
  - Pagination (sahypalama)
  - Emläk kartlary (baha, otag, meýdan, ýerleşiş, surat)
- **Emläk jikme-jikligi (Property Details)**:
  - Suratlar galereýasy we kiçi suratlary saýlamak
  - Doly häsiýetnamalar we düşündiriş
  - Bildiriş eýesi barada maglumat we jaň etmek
  - Göni habarlaşmak we sorag ibermek formasy (`/api/properties/{id}/inquiries`)
  - Halananlara goşmak / aýyrmak
- **Täze emläk goşmak (Create Property)**:
  - Formany doldurmak (kategoriýa, baha, otag, meýdan, şäher, salgy, düşündiriş)
  - Birnäçe suraty birden ýüklemek we göni synlamak (image preview)
- **Halananlar (Favorites)**:
  - Ulanyjynyň halan emläkleriniň aýratyn sahypasy
- **Ulanyjy ulgamy (Auth & Profile)**:
  - Agza bolmak (Register)
  - Ulgama girmek (Login)
  - Şahsy profil sahypasy (Profile)
  - Howpsuz çykyş (Logout)
- **Dizaýn & Rejimler**:
  - Gijeki / Gündizki rejim (Dark / Light mode)
  - Responsive dizaýn (Mobile, Tablet, Desktop)
  - Toast habarnamalar (Toasts)

---

## Backend bilen arabaglanyşyk (API Proxy)

`vite.config.js` faýlynda Vite Proxy sazlanan bolup, ähli `/api` we `/storage` soraglary awtomatiki `http://127.0.0.1:8000` (Laravel backend) salgysyna gönükdirilýär.

```bash
# Frontend-i işletmek:
npm run dev
```

---

## Komandalar

```bash
# Paketleri gurmak
npm install

# Ösüş serwerini işletmek (Development)
npm run dev

# Önümçilik üçin gurnamak (Build)
npm run build

# Synlamak (Preview)
npm run preview
```
