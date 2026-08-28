# DEC-008: TypeScript-PWA als modularer Monolith

**Status:** Accepted<br>
**Datum:** 2026-08-28<br>
**Owner:** WatzingerM21052<br>
**Betroffene Releases/Requirements:** v0.1-v4.0; NFR-004/010/016-020; CON-004/006/017/020

## Kontext

DnDimension soll als Website und lokale Installation funktionieren, offline nutzbar bleiben, eine hochwertige Weboberfläche ermöglichen und die lokale Entwicklungsumgebung nicht durch mehrere native SDKs, Browser-Runtimes oder Container aufblähen. Spätere Accounts, Realtime, VTT und KI dürfen den lokalen Kern nicht zu einem Neuentwurf zwingen.

Ein einzelner Entwickler benötigt außerdem kurze Feedbackzyklen und einfache, günstige Releases. Eine vorsorglich verteilte Architektur würde Service Discovery, Netzwerkfehler, Versionierung, Datenkonsistenz, Deployment und Observability einführen, bevor dafür ein betrieblicher Nutzen existiert.

## Optionen

1. **TypeScript, React, Vite und installierbare PWA als modularer Monolith:** eine Codebasis, statischer Build, starke UI-Basis, local-first und später selektiv extrahierbar.
2. **C#/.NET mit Blazor PWA oder MAUI:** gemeinsame C#-Basis und gute .NET-Integration, aber für dieses Projekt weniger direkte Web-UI-Auswahl sowie bei MAUI zusätzliche native Workloads.
3. **Ionic/Capacitor oder Electron ab Projektstart:** schneller Native-/App-Store-Weg, aber zusätzliche Abstraktion, Buildartefakte und im Electron-Fall eine eigene Browserruntime.
4. **Microservices ab v0.x:** unabhängige Deployments und Skalierung, aber unnötige Betriebs-, Test- und Konsistenzkomplexität für eine lokale Ein-Personen-App.

## Entscheidung

DnDimension verwendet TypeScript, React, Vite und pnpm und wird als Website sowie installierbare PWA aus demselben statischen Build ausgeliefert. Die Anwendung startet als modularer Monolith mit erzwungenen Package- und Bounded-Context-Grenzen.

Domain, Rules, Content, Application, Persistenzadapter, UI und Features werden getrennt. Kommunikation erfolgt über öffentliche Verträge, Commands, Queries und Events. Tiefe Cross-Package-Imports, zyklische Abhängigkeiten und direkter UI-Datenbankzugriff sind verboten und werden automatisiert geprüft.

Ein Bereich wird erst als separater Dienst extrahiert, wenn unabhängige Skalierung, Sicherheitsgrenze, Laufzeit, Teamverantwortung, Deployment oder Hintergrund-/Realtime-Verarbeitung den Aufwand rechtfertigt. Accounts, Realtime, Medienverarbeitung und KI sind erwartbare Kandidaten. Tauri bleibt eine spätere Option, falls PWA-Dateirechte oder Distributionsanforderungen nachweislich nicht genügen.

## Folgen und Trade-offs

- Website und lokale Installation verwenden dieselbe Sprache und denselben Build.
- v1 benötigt keinen Server und keine native Toolchain.
- Der TypeScript-Domain-/Rules-Kern kann später auch in Worker- oder Node-Laufzeiten genutzt werden.
- Moduldisziplin muss durch Exports, Linting, Architektur- und Contract Tests erhalten werden; Ordnernamen allein reichen nicht.
- Eine spätere Service-Extraktion ist vorbereitet, aber nie arbeitsfrei. Datenmigration, Netzwerkausfälle und neue Sicherheitsgrenzen müssen dann bewusst implementiert werden.
- Native App-Store- oder Dateisystemfunktionen werden nicht vorweggenommen.

## Ersetzt / ersetzt durch

Konkretisiert den führenden Kandidaten der Master Vision; ersetzt keine frühere Decision.
