# 🧠 Zihin Dostu: RAG ve Yüz Tanıma Tabanlı Yapay Zeka Destekli Psikolojik Asistan

Bu proje, Fırat Üniversitesi Yazılım Mühendisliği bitirme çalışması kapsamında geliştirilmiştir. Zihin Dostu, sıradan bir sohbet botu değil; 
merkezine **RAG (Retrieval-Augmented Generation)** mimarisini alan ve anlık duygu durumunu yüz tanıma teknolojileriyle analiz eden yenilikçi 
bir yapay zeka asistanıdır.

Büyük dil modellerinin (LLM) en büyük problemi olan halüsinasyon (yanlış veya uydurma bilgi üretme) riski, bu projede kurulan RAG mimarisi sayesinde etkili 
bir şekilde engellenmiştir. Sistem, genel internet verisiyle değil, yalnızca sisteme entegre edilmiş bilimsel psikoloji kaynakları üzerinden çalışarak kullanıcılara %100 kanıta dayalı ve güvenilir tavsiyeler sunar.

## ✨ Temel Özellikler

* **Gerçek Zamanlı Duygu Analizi:** Kullanıcının anlık duygu durumu, kameradan `face-api.js` kullanılarak (Edge Computing) algılanır ve yapay zekanın yanıtlarını daha empatik hale getirmesi için promptlara dahil edilir.
* **RAG Mimarisi ile Güvenilir Yanıtlar:** Sistem, genel internet verisi yerine Uzman Psikolog kaynaklarından derlenen dokümanlarla beslenmiştir. Vektör araması sayesinde sadece bilimsel geçerliliği olan rahatlama teknikleri (örn. nefes egzersizleri, bilişsel çarpıtma analizleri) sunulur.
* **Akıllı Seans Geçmişi:** Kullanıcıların önceki sohbetleri, yapay zeka tarafından analiz edilerek özetlenir ve kullanıcının baskın duygu durumu (örn: "Endişeli") etiketlenerek geçmiş seanslar sayfasına kaydedilir.
* **Kişiselleştirilmiş ve Güvenli Deneyim:** JWT (JSON Web Token) altyapısı ile kullanıcı izolasyonu sağlanır.

## 🛠️ Kullanılan Teknolojiler

Proje, modern ve ölçeklenebilir bir Full-Stack mimari üzerine inşa edilmiştir:

**Frontend (İstemci):**
* React & TypeScript
* Tailwind CSS (Modern ve sakinleştirici UI tasarımı)
* `face-api.js` (Tarayıcı tabanlı duygu analizi)

**Backend (Sunucu):**
* Node.js & Express.js
* JWT (Kimlik Doğrulama Katmanı)

**Veritabanı & Yapay Zeka:**
* MongoDB Atlas (Kullanıcı verileri ve Vektör Veritabanı)
* Google Gemini LLM API (Üretken Yapay Zeka Modeli)
