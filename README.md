# КИОСК - Filoloji Terminali PRO

**КИОСК - Filoloji Terminali**, Rusça öğrenimini kiosk/market senaryosu üzerinden oyunlaştıran tarayıcı tabanlı bir eğitim oyunudur.

Oyuncu, Rusça konuşan turistlerin siparişlerini dinler, duyduğu cümlenin Latin/Türkçe fonetik okunuşunu yazar, terminalde kısa çözümleme ve mini quizleri geçer, ardından doğru ürünü müşteriye verir.

Oyun, Rusçayı sadece ezberle değil; **duyma, ayırt etme, anlam kurma, bağlam içinde tekrar etme ve refleks geliştirme** mantığıyla öğretmeyi amaçlar.

---

## Oyun Hikayesi

Cansu, Rusçayı kitaplardan değil gerçek karşılaşmalardan öğrenmek için bir kiosk açar.

Turistler gelir, Rusça konuşur. Oyuncu, müşterilerin ne istediğini duyduğuna göre çözmeye çalışır. Kiril bilmek zorunlu değildir; fakat oyuncunun kulağını çalıştırması gerekir.

Oyunun temel mottosu:

> **Duy, çöz, söyle, sat.**

---

## Temel Oynanış

1. Turist kioska gelir.
2. Rusça sipariş cümlesi Kiril olarak görünür.
3. Turistin sesi çalar.
4. Oyuncu duyduğu cümlenin fonetik okunuşunu yazar.
5. Terminal oyuncunun yazdığını kontrol eder.
6. Oyuncu kısa çözümleme veya hızlı kontrol görür.
7. Mini quiz çözülür.
8. Raflar açılır.
9. Oyuncu doğru ürünü seçer.
10. Ürün müşteriye doğru hareket eder.
11. Doğru satışta müşteri mutlu olur, kasa açılır ve para sesi çalar.
12. Yanlış satışta müşteri tepki verir ve yanlışlar tekrar sistemine eklenir.

---

## Özellikler

- Rusça turist siparişleri
- Kiril cümle gösterimi
- Latin/Türkçe fonetik duyum yazma sistemi
- Kolay, orta ve zor mod
- Turist kişilikleri:
  - Kibar turist
  - Aceleci turist
  - Sessiz turist
  - Doğrudan turist
- Terminal tabanlı çözümleme sistemi
- Mini quiz sistemi
- Hızlı kontrol sistemi
- Padej keşif sistemi
- Kültür notları
- Yanlışları tekrar getiren öğrenme döngüsü
- XP sistemi
- Başarımlar
- Sözlüğüm / Öğrenilenler sekmesi
- Kelime ilerleme kartları
- Vardiya sonu karnesi
- Para sesi ve kasa animasyonu
- Doğru üründe ürünün müşteriye gitme animasyonu
- Müşteri idle / happy / angry tepkileri
- Not defteri
- Mini sözlük

---

## Oyun Modları

### Kolay Mod

Yeni başlayan oyuncular için daha toleranslıdır.

- Daha uzun süre
- Daha yumuşak çözümleme
- Sesleri yakalamaya odaklı yapı
- Bebeklerin dil öğrenme mantığına yakın ilerleme

### Orta Mod

Standart oyun deneyimidir.

- Normal süre
- Normal çözümleme toleransı
- Terminal ve mini quiz dengeli çalışır

### Zor Mod

Daha hızlı refleks isteyen moddur.

- Daha kısa süre
- Daha az tolerans
- Daha dikkatli dinleme gerektirir
- Kulak ve refleks gelişimini öne çıkarır

---

## Eğitim Tasarımı

Oyun şu pedagojik döngü üzerine kuruludur:

```text
Dinleme → Sesleri Ayırt Etme → Fonetik Yazma → Anlam Çıkarma → Mini Quiz → Ürün Seçme → Tekrarla Pekiştirme

Amaç, oyuncunun Rusçayı sadece okuyarak değil; duyarak, tahmin ederek ve bağlam içinde kullanarak öğrenmesidir.

Oyuncu Kiril cümleyi görür, fakat cevabı Kiril ile yazmaz. Böylece Kiril harflerine göz aşinalığı oluşurken asıl beceri olarak duyma ve anlam kurma öne çıkar.

Amaç, oyuncunun Rusçayı sadece okuyarak değil; duyarak, tahmin ederek ve bağlam içinde kullanarak öğrenmesidir.

Oyuncu Kiril cümleyi görür, fakat cevabı Kiril ile yazmaz. Böylece Kiril harflerine göz aşinalığı oluşurken asıl beceri olarak duyma ve anlam kurma öne çıkar.

## Padej Avı Sistemi

Oyunda Rusça padejler soyut gramer tabloları olarak değil, mikro durumlar üzerinden öğretilir.

Örneğin:

вода → воду

Bu değişim oyuncuya “neden değişti?” sorusuyla açıklanır.

Padej sistemi şu mantıkla çalışır:

Oyuncu cümledeki kelime değişimini görür.
Terminal kısa bir açıklama verir.
Padej ismi, fonetik okunuşu ve Türkçe karşılığı gösterilir.
Oyuncu bu bilgiyi mini quiz ile pekiştirir.
Keşfedilen padejler öğrenilenler sekmesinde birikir.

## Telefon Sekmeleri

Oyundaki telefon, oyuncunun öğrenme merkezidir.

### Terminal

Oyuncu duyduğu cümleyi buraya yazar. Terminal duyumu kontrol eder, çözümleme ve mini quizleri açar.

### Mini Sözlük

Mevcut siparişteki kelimeleri gösterir. Oyuncu başta bu bilgiyi doğrudan göremez; önce duyduğunu yazması gerekir.

### Not Defteri

Oyuncu kendi çağrışımlarını ve hatırlama notlarını yazabilir.

Örnek:

pajalusta = pala dayı lütfen

### Öğrenilernler

Üst üste doğru çözülen kelimeler burada birikir. Kelime kartlarında ilerleme bilgileri gösterilir.

### Başarımlar

Satış, dinleme, padej avı ve hızlı çözme başarımları burada görünür.

## Sözlüğüm / Öğrenilenler Sistemi

Oyuncu bir kelimeyi tekrar tekrar doğru çözdükçe kelime öğrenilmiş kabul edilir.

Kelime kartlarında şu bilgiler tutulur:

Kelimenin fonetik okunuşu
Türkçe anlamı
Görülme sayısı
Doğru sayısı
Yanlış sayısı
Seri
Başarı oranı
Öğrenme seviyesi
Son görüldüğü cümle
Bağlı padej bilgisi

Bu sistem, oyuncunun ilerlemesini görünür hale getirir.

## Vardiya Sonu Karnesi

Belirli sayıda müşteri sonrasında oyuncuya vardiya karnesi gösterilir.

Karnede şu bilgiler yer alır:

Toplam müşteri sayısı
Doğru satış sayısı
Kazanılan XP
Keşfedilen padej sayısı
Öğrenilen kelimeler
Tekrar edilmesi gereken siparişler
Günün padej notu
Vardiya yorumu

Bu ekran, oyuncunun öğrenme durumunu özetler.

##Başarımlar

Oyunda çeşitli başarımlar bulunur.

Örnek başarımlar:

İlk satış
Terminali etkili kullanma
Padej keşfi
Birden fazla padej keşfi
Öğrenilen kelimeler
Hızlı satış kontrolü
Panik anında doğru satış
Çay siparişini çözme
Vardiya tamamlama

## Çalıştırma

Projeyi çalıştırmak için dosyaları aynı klasör yapısında tutman gerekir.

Tarayıcıdan doğrudan index.html dosyasını açabilirsin. Ancak data.json dosyası JavaScript tarafından yüklendiği için bazı tarayıcılarda yerel sunucu kullanmak daha sağlıklı olur.

Python kuruluysa proje klasöründe şu komutu çalıştır:

python -m http.server 5500

Sonra tarayıcıdan şu adrese git:
http://localhost:5500

## Geliştirme Durumu

Proje aktif geliştirme aşamasındadır.

Mevcut durumda oyun temel olarak oynanabilir durumdadır. Ana mekanikler, terminal sistemi, ses sistemi, ürün seçimi, sözlük sistemi, başarımlar ve vardiya karnesi çalışmaktadır.

## Planlanan Geliştirmeler

Çalışma ortamını geliştirme
Daha fazla Rusça sipariş senaryosu
Daha fazla kelime ve ürün
Daha dengeli quiz sistemi
Bölüm/gün sistemi
Yeni müşteri tipleri
Daha fazla başarımlar
Mobil uyumluluk
İleride yeni mekanlar

## Kullanılan Teknolojiler

HTML
CSS
JavaScript
JSON
Tarayıcı tabanlı ses ve görsel asset sistemi

Framework kullanılmamıştır. Proje vanilla JavaScript ile geliştirilmiştir.

## Not

Bu proje bir dil öğrenme oyunu prototipidir. Amaç, Rusça öğrenen oyunculara duyma, ayırt etme, fonetik yazma ve bağlam içinde anlam kurma pratiği yaptırmaktır.

# Lisans

Bu projedeki kod, görsel, ses, veri ve tasarım öğeleri proje sahibine aittir.

İzinsiz ticari kullanım yapılamaz.

Copyright © 2026 Cansu Ceylan


İntro videosu geliştirme aşamasında repo dışında tutulmuştur***