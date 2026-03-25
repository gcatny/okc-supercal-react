import React, { useState } from 'react';
import { DISTRICTS } from '../data/districts';
import { GOOGLE_SHEET_URL, sendToGoogleSheet } from '../services/googleSheets';

const CATEGORIES = [
  { value: 'music', label: 'Concert / Music' },
  { value: 'fest', label: 'Festival / Market' },
  { value: 'theater', label: 'Theater' },
  { value: 'comedy', label: 'Comedy' },
  { value: 'sports', label: 'Sports' },
  { value: 'art', label: 'Art & Gallery' },
  { value: 'food', label: 'Food & Bar' },
  { value: 'film', label: 'Film' },
  { value: 'family', label: 'Family & Kids' },
  { value: 'free', label: 'Free Event' },
  { value: 'culture', label: 'Culture & Heritage' },
  { value: 'running', label: 'Running & Fitness' },
  { value: 'civic', label: 'Civic & Gov' },
  { value: 'industry', label: 'Industry' },
  { value: 'convention', label: 'Convention' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'fundraiser', label: 'Fundraiser & Gala' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'farmersmarket', label: 'Farmers Market' },
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function SubmitEventForm({ isOpen, onClose, onShowToast }) {
  const [subType, setSubType] = useState('event');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [category, setCategory] = useState('music');
  const [district, setDistrict] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [contact, setContact] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurFreq, setRecurFreq] = useState('weekly');
  // HH fields
  const [hhTime, setHhTime] = useState('');
  const [hhDays, setHhDays] = useState([0, 1, 2, 3, 4]);
  const [hhPatio, setHhPatio] = useState(false);
  const [hhRooftop, setHhRooftop] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Validate required fields
    if (!name.trim()) { alert('Please enter a name.'); return; }
    if (subType === 'event' && !date) { alert('Please enter a date.'); return; }
    if (subType === 'hh' && !hhTime.trim()) { alert('Please enter happy hour time.'); return; }
    if (!venue.trim()) { alert('Please enter a venue.'); return; }
    if (!url.trim()) { alert('Please enter a URL for verification.'); return; }

    setSubmitting(true);

    const submission = subType === 'event' ? {
      type: 'event',
      name: name.trim(),
      date,
      venue: venue.trim(),
      category,
      district,
      url: url.trim(),
      description: desc.trim(),
      contact: contact.trim(),
      recurring,
      recurFreq: recurring ? recurFreq : null,
      submittedAt: new Date().toISOString(),
    } : {
      type: 'happyhour',
      name: name.trim(),
      venue: venue.trim(),
      hhTime: hhTime.trim(),
      hhDays,
      district,
      url: url.trim(),
      description: desc.trim(),
      contact: contact.trim(),
      patio: hhPatio,
      rooftop: hhRooftop,
      submittedAt: new Date().toISOString(),
    };

    try {
      await sendToGoogleSheet(submission);
      onShowToast('Event submitted! We\'ll review and add it soon.');
      // Reset form
      setName(''); setDate(''); setVenue(''); setUrl(''); setDesc(''); setContact('');
      setHhTime(''); setHhPatio(false); setHhRooftop(false);
      onClose();
    } catch (err) {
      // Store locally as fallback
      const pending = JSON.parse(localStorage.getItem('okcsupercal_pending') || '[]');
      pending.push(submission);
      localStorage.setItem('okcsupercal_pending', JSON.stringify(pending));
      onShowToast('Saved locally! Will sync when connection is restored.');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const toggleHhDay = (dayIdx) => {
    setHhDays(prev =>
      prev.includes(dayIdx) ? prev.filter(d => d !== dayIdx) : [...prev, dayIdx]
    );
  };

  const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid var(--border2)',
    borderRadius: '6px', background: 'var(--bg)', color: 'var(--text)',
    fontSize: '13px', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box'
  };
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: 500, color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px'
  };

  return (
    <div id="submit-panel">
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border2)', borderRadius: '10px', padding: '24px 28px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '.05em', color: 'var(--text)' }}>
            SUBMIT TO THE CALENDAR
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--muted)', padding: '0 4px' }}>✕</button>
        </div>

        {/* Type Switcher */}
        <div style={{ display: 'flex', gap: 0, marginBottom: '20px', border: '1px solid var(--border2)', borderRadius: '8px', overflow: 'hidden' }}>
          <button onClick={() => setSubType('event')} style={{
            flex: 1, padding: '10px 16px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, border: 'none', cursor: 'pointer',
            background: subType === 'event' ? 'var(--accent)' : 'var(--surface)',
            color: subType === 'event' ? '#fff' : 'var(--muted)'
          }}>📅 Event</button>
          <button onClick={() => setSubType('hh')} style={{
            flex: 1, padding: '10px 16px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, border: 'none', cursor: 'pointer',
            background: subType === 'hh' ? 'var(--accent)' : 'var(--surface)',
            color: subType === 'hh' ? '#fff' : 'var(--muted)'
          }}>🍸 Happy Hour</button>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.6, marginBottom: '20px' }}>
          {subType === 'event'
            ? 'Know about an OKC event we\'re missing? Submit it below with a link to the official source so we can verify and add it.'
            : 'Know a bar or restaurant with a great happy hour? Submit it below and we\'ll add it to the Happy Hours section.'
          }
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
          <div>
            <label style={labelStyle}>{subType === 'event' ? 'Event Name *' : 'Venue / Bar Name *'}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={subType === 'event' ? 'e.g. Jones Assembly: Blackberry Smoke' : 'e.g. The Mule'} style={inputStyle} />
          </div>

          {subType === 'event' ? (
            <div>
              <label style={labelStyle}>Date *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} style={{ accentColor: 'var(--accent)', width: '15px', height: '15px' }} />
                  This is a recurring event
                </label>
                {recurring && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {['daily', 'weekly', 'monthly'].map(f => (
                      <label key={f} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '4px 10px', border: '1px solid var(--border2)', borderRadius: '16px', background: 'var(--surface)', cursor: 'pointer' }}>
                        <input type="radio" name="recur-freq" value={f} checked={recurFreq === f} onChange={() => setRecurFreq(f)} style={{ accentColor: 'var(--accent)' }} />
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label style={labelStyle}>Happy Hour Time *</label>
              <input type="text" value={hhTime} onChange={e => setHhTime(e.target.value)} placeholder="e.g. 3-6 PM Mon-Fri" style={inputStyle} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Venue / Location *</label>
            <input type="text" value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Jones Assembly, OKC" style={inputStyle} />
          </div>

          {subType === 'event' ? (
            <div>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label style={labelStyle}>Days Available *</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                {DAY_NAMES.map((day, idx) => (
                  <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--text)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={hhDays.includes(idx)} onChange={() => toggleHhDay(idx)} style={{ accentColor: 'var(--happyhour)' }} />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>District</label>
            <select value={district} onChange={e => setDistrict(e.target.value)} style={inputStyle}>
              <option value="">-- Select District --</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {subType === 'hh' && (
            <div>
              <label style={labelStyle}>Features</label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={hhPatio} onChange={e => setHhPatio(e.target.checked)} style={{ accentColor: 'var(--happyhour)', width: '16px', height: '16px' }} />
                  Patio
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={hhRooftop} onChange={e => setHhRooftop(e.target.checked)} style={{ accentColor: 'var(--happyhour)', width: '16px', height: '16px' }} />
                  Rooftop
                </label>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Official URL / Ticketing Link * <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px' }}>(required for verification)</span></label>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://tickets.example.com/event" style={inputStyle} />
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Description</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Brief description..." style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={labelStyle}>Your Name & Email <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px' }}>(optional)</span></label>
          <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Jane Smith — jane@example.com" style={inputStyle} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleSubmit} disabled={submitting} style={{
            padding: '11px 28px', background: 'var(--accent)', border: 'none', borderRadius: '6px',
            color: '#fff', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1
          }}>
            {submitting ? 'Submitting…' : `Submit ${subType === 'event' ? 'Event' : 'Happy Hour'}`}
          </button>
          <button onClick={onClose} style={{
            padding: '11px 20px', background: 'transparent', border: '1px solid var(--border2)',
            borderRadius: '6px', color: 'var(--muted)', fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px', cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
