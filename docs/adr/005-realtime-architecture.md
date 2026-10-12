# ADR 005: Real-Time Communication Architecture

## Status
Accepted

## Context
Kitchen staff require instant, hands-free order alerts as soon as counter or online orders are submitted. Re-querying or manual refreshing is impractical in a busy bakery kitchen.

## Decision
We implement a hybrid real-time synchronization architecture:
1. **Socket.IO over Node.js Server (`server.ts`)**:
   - Clients authenticate with JWT/session token and join tenant-scoped rooms: `tenant:{tenantId}:kitchen`, `tenant:{tenantId}:pos`.
   - Backend emits events: `kot:created`, `kot:status_updated`, `order:new`.
2. **PostgreSQL as Single Source of Truth**:
   - All events are committed to PostgreSQL prior to emitting socket events.
   - Socket payloads carry ticket metadata, but clients reconcile against REST API on reconnection.
3. **Voice Queue Audio Driver**:
   - Browser Web Speech API (`SpeechSynthesis`) on the Kitchen display listens for `kot:created` and `kot:status_updated`.
   - Supports announcements in English (`en-IN`) and Telugu (`te-IN`).
