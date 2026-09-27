# DEC-009: Lokale Persistenz, Backups und spätere SQL-Cloud

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.1-v1.5; FR-002/010/012/013; NFR-003/005-008/013/015-018/020; CON-002/006/013/018/019

## Kontext

v1.0 muss ohne Account und Netzwerk mehrere Charaktere, Kampagnen und Sitzungen zuverlässig speichern. Sessionzustand, Audit-Events und Snapshots benötigen atomare Änderungen und Migrationen. Browserdaten können dennoch durch den Nutzer gelöscht oder ohne gewährte Persistenz unter Speicherdruck entfernt werden. Die private PDF-Bibliothek darf nicht dupliziert oder zur Laufzeitvoraussetzung werden.

Spätere Accounts, Geräte-Synchronisation und Gruppen benötigen voraussichtlich zentrale relationale Daten, dürfen aber keine Cloudabhängigkeit in v1 erzeugen.

## Optionen

1. **IndexedDB über isolierten Dexie-Adapter plus portable Backups:** browserstandardisiert, offline und transaktional; Haltbarkeit wird durch Export/Restore ergänzt.
2. **LocalStorage oder einzelne JSON-Downloads als Primärspeicher:** einfach, aber ungeeignet für Datenmenge, Transaktionen, Indizes, Migration und atomare Sitzungsänderungen.
3. **Native SQLite/Tauri ab v1:** starke Dateihaltbarkeit und SQL, aber zusätzlicher Rust-/Desktop-Stack und keine einheitliche reine Webausführung.
4. **Cloud-SQL als einzige Wahrheit ab v1:** zentrale Haltbarkeit, aber Account-, Kosten-, Datenschutz-, Offline- und Synczwang vor Produktvalidierung.

## Entscheidung

v1 speichert strukturierte Daten in einer versionierten IndexedDB. Dexie implementiert den lokalen Adapter hinter Application-Ports; Domain und UI kennen Dexie nicht. In-Memory- und IndexedDB-Adapter bestehen dieselben Repository-, Unit-of-Work- und Migration-Contract-Tests.

Die Anwendung fordert Browser-Persistenz an, zeigt Speicherverbrauch an und kommuniziert das Restrisiko ehrlich. Portable `.dndim`-Backups mit Manifest, Versionen, Prüfsummen, Inspektionsphase und bestätigtem Restore sind ein P0-Bestandteil vor v1.0.

Private PDFs, Scans und Buchkarten werden nicht in IndexedDB, Build, Tests oder Standardbackups kopiert. Katalogmetadaten und bewusst gewählte Dateihandles sind zulässig. OCR, Suchindex und Thumbnails sind begrenzte, löschbare Derived Caches.

Ab Accounts/Cloud wird relationale SQL-Persistenz hinter eigenen Adaptern ergänzt. Cloudflare D1/Workers ist aktuell führender Free-first-Kandidat; PostgreSQL bleibt der strategische Fallback. Realtime-Koordination darf später Durable Objects oder eine gleichwertige Implementierung verwenden. Kein Cloudanbieter wird Teil des Domainvertrags.

## Folgen und Trade-offs

- v1 bleibt vollständig offline und verursacht keine Pflichtbetriebskosten.
- IndexedDB-Transaktionsregeln, Browser-Eviction, Multi-Tab-Konflikte und Service-Worker-/DB-Upgrades müssen in Spikes und Tests nachgewiesen werden.
- Backup/Restore ist wegen der Browsergrenze unverzichtbar und keine Komfortfunktion.
- Lokaler und späterer Cloudzustand benötigen explizite Revisions-, Idempotenz- und Synchronisationsverträge.
- D1-, PostgreSQL- oder Providerpreise werden unmittelbar vor Einführung neu bewertet.
- Eine native Dateidatenbank kann später ergänzt werden, ohne das portable Domainmodell zu ersetzen.

## Validierung

Spike P-02 (#20) bestätigt die Entscheidung am 2026-09-27 mit Tests im echten Chromium und unter fake-indexeddb, siehe [P-02 Report](../research/v0.1-persistence-spike-report.md): atomare Commits, optimistische Tab-Koordination mit `BroadcastChannel`-Hinweis und Revisionsprüfung, verlustfreie Abbrüche von Schema-Upgrades, Backup vor jeder Migration und Messwerte zu Größe und Quota. `persist()` wurde in einem frischen Profil abgelehnt, was die Pflicht zu Backup/Restore bestätigt. Ein manueller Edge-Nachweis steht noch aus.

## Ersetzt / ersetzt durch

Konkretisiert die offene Persistenzentscheidung aus v0.2 und DEC-006; ersetzt keine frühere Decision.
