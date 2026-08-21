<!-- Eval fixture for the idea-to-prd skill: a deliberately informal feature
     brief, the way an idea actually arrives. The skill must turn this into a
     structured PRD with labeled requirements. -->

# Feature Brief: Note Templates

People keep pasting the same structure into new notes — meeting notes with an
attendees line and action items, weekly reviews with the same three headings,
one-on-one agendas. We want templates: a user can turn an existing note into a
template, and creating a new note offers a template picker.

Rough shape:

- "Save as template" on any note; templates get a name.
- New-note flow shows templates (plus "Blank"); picking one pre-fills the note.
- Templates are per-device for now — localStorage is fine, no server work.
- Users need to be able to rename and delete templates.
- Shouldn't slow down the new-note flow for people who never use templates.

Out of scope: sharing templates, template variables/placeholders, and any
server-side storage.
