import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './styles/global.css';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilters from './components/CategoryFilters';
import HappyHourPanel from './components/HappyHourPanel';
import DistrictPanel from './components/DistrictPanel';
import CalendarGrid from './components/CalendarGrid';
import EventDetail from './components/EventDetail';
import FilteredEventList from './components/FilteredEventList';
import SubmitEventForm from './components/SubmitEventForm';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Hooks
import { useCalendar } from './hooks/useCalendar';
import { useFilters } from './hooks/useFilters';
import { useSearch } from './hooks/useSearch';
import { useVoting } from './hooks/useVoting';

// Data
import { ALL_CATS } from './data/categories';
import { HH_DISTRICT_MAP } from './data/districts';

// Utils
import { catMatch, passesHHFilter, generateHappyHourEvents } from './utils/eventUtils';
import { voteKey } from './utils/eventUtils';

// Import data - these will be JSON files the nightly agent produces
import eventsData from './data/events.json';
import happyHoursData from './data/happyHours.json';

export default function App() {
  // Build the full events list (base events + generated HH events)
  const allEventsRaw = useMemo(() => {
    try {
      const base = Array.isArray(eventsData) ? [...eventsData] : [];
      const hhEvents = generateHappyHourEvents(happyHoursData, HH_DISTRICT_MAP);
      return [...base, ...hhEvents]
        .filter(ev => ev && ev.date && ev.name)
        .sort((a, b) => (a.date || '') < (b.date || '') ? -1 : 1);
    } catch (err) {
      console.error('Error building events list:', err);
      return Array.isArray(eventsData) ? [...eventsData] : [];
    }
  }, []);

  // Hooks
  const { calYear, calMonth, prevMonth, nextMonth, goToday } = useCalendar();
  const {
    activeFilters, districtActive, hhOn, hhPatio, hhRoof,
    toggleFilter, toggleAllCats, toggleDistrict,
    toggleHH, toggleHHPatio, toggleHHRoof, resetAll
  } = useFilters();
  const { voteCounts, votedKeys, loadVoteCount, toggleVote } = useVoting();

  // Selected event for detail panel
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  // Filter events based on active filters
  const filteredEvents = useMemo(() => {
    return allEventsRaw.filter(ev => {
      if (!catMatch(ev, activeFilters)) return false;
      if (!passesHHFilter(ev, hhOn, hhPatio, hhRoof)) return false;
      if (districtActive && ev.district !== districtActive) return false;
      return true;
    });
  }, [allEventsRaw, activeFilters, hhOn, hhPatio, hhRoof, districtActive]);

  // Search uses ALL events (not filtered)
  const search = useSearch(allEventsRaw);

  // District counts
  const districtCounts = useMemo(() => {
    const counts = {};
    allEventsRaw.forEach(ev => {
      if (ev.district && catMatch(ev, activeFilters)) {
        counts[ev.district] = (counts[ev.district] || 0) + 1;
      }
    });
    return counts;
  }, [allEventsRaw, activeFilters]);

  // HH counts
  const hhCounts = useMemo(() => {
    const hhVenues = happyHoursData;
    const patioCount = hhVenues.filter(h => h.patio).length;
    const rooftopCount = hhVenues.filter(h => h.rooftop).length;
    return { total: hhVenues.length, patio: patioCount, rooftop: rooftopCount };
  }, []);

  // Event click handler
  const handleEventClick = useCallback((ev) => {
    setSelectedEvent(ev);
    const key = voteKey(ev);
    loadVoteCount(key);
  }, [loadVoteCount]);

  // Vote handler
  const handleVote = useCallback(async (key) => {
    const justVoted = await toggleVote(key);
    if (justVoted) showToast('Liked! Your vote has been counted.');
  }, [toggleVote, showToast]);

  // Reset all handler
  const handleReset = useCallback(() => {
    resetAll();
    setSelectedEvent(null);
    search.clearSearch();
    goToday();
  }, [resetAll, search, goToday]);

  return (
    <div className="app">
      <Header onReset={handleReset} onSubmitToggle={() => setSubmitOpen(s => !s)} />

      <SearchBar
        searchQuery={search.searchQuery}
        onSearch={search.onSearch}
        clearSearch={search.clearSearch}
        results={search.searchResults}
        visibleResults={search.visibleResults}
        isOpen={search.isOpen}
        setIsOpen={search.setIsOpen}
        showMore={search.showMore}
        hasMore={search.hasMore}
        onEventClick={handleEventClick}
      />

      <SubmitEventForm
        isOpen={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onShowToast={showToast}
      />

      {/* Category Filters + Happy Hours row */}
      <div className="filter-hh-row">
        <CategoryFilters
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          onToggleAll={toggleAllCats}
        />
        <HappyHourPanel
          hhOn={hhOn}
          onToggleHH={toggleHH}
          hhPatio={hhPatio}
          onTogglePatio={toggleHHPatio}
          hhRoof={hhRoof}
          onToggleRoof={toggleHHRoof}
          venueCount={hhCounts.total}
          patioCount={hhCounts.patio}
          rooftopCount={hhCounts.rooftop}
        />
      </div>

      {/* Mobile HH + District row */}
      <div id="hh-dist-mobile-row">
        <div className="hh-section" id="hh-section-mobile" style={{ flex: '1 1 50%', minWidth: 0, border: '1.5px solid #e0e0e0', borderRadius: '10px', background: '#fff', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px 8px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '.07em', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>HAPPY HOURS</div>
          <div style={{ padding: '4px 10px 4px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10.5px', color: 'var(--text)', fontFamily: "'DM Sans', sans-serif" }}>
            <span>Total Venues</span>
            <span className="dist-count">{hhCounts.total}</span>
          </div>
          <div style={{ padding: '4px 10px 4px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label className="hh-main-toggle" style={{ fontSize: '10px' }}>
              <input type="checkbox" checked={hhOn} onChange={toggleHH} />
              <span className="hh-switch" style={{ transform: 'scale(0.75)', transformOrigin: 'left center' }}></span>
              Show on Calendar
            </label>
          </div>
          <div style={{ padding: '4px 10px 8px 12px', display: 'flex', gap: '6px' }}>
            <button className={`hh-pill${hhPatio ? ' active' : ''}`} onClick={toggleHHPatio} style={{ fontSize: '10px', padding: '3px 8px' }}>
              Patio <span className="hh-count">{hhCounts.patio}</span>
            </button>
            <button className={`hh-pill${hhRoof ? ' active' : ''}`} onClick={toggleHHRoof} style={{ fontSize: '10px', padding: '3px 8px' }}>
              Rooftop <span className="hh-count">{hhCounts.rooftop}</span>
            </button>
          </div>
        </div>
        <div id="district-panel-mobile">
          <div style={{ padding: '10px 12px 8px', fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', letterSpacing: '.07em', color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>Districts</div>
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {Object.entries(districtCounts).filter(([,c]) => c > 0).sort((a,b) => a[0].localeCompare(b[0])).map(([dist, count]) => (
              <div key={dist} className={`dist-item${districtActive === dist ? ' dist-active' : ''}`} onClick={() => toggleDistrict(dist)}>
                <span className="dist-name">{dist}</span>
                <span className="dist-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content: Calendar + District sidebar */}
      <div id="cal-sidebar-wrap">
        <div id="cal-view">
          <CalendarGrid
            calYear={calYear}
            calMonth={calMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            goToday={goToday}
            events={filteredEvents}
            activeFilters={activeFilters}
            districtActive={districtActive}
            hhOn={hhOn}
            hhPatio={hhPatio}
            hhRoof={hhRoof}
            onEventClick={handleEventClick}
            searchQuery={search.searchQuery}
          />

          {/* Event Detail */}
          {selectedEvent && (
            <EventDetail
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onVote={handleVote}
              voteCount={voteCounts[voteKey(selectedEvent)] || 0}
              hasVoted={votedKeys[voteKey(selectedEvent)] || false}
            />
          )}

          {/* Filtered Event List */}
          <FilteredEventList
            events={filteredEvents}
            activeFilters={activeFilters}
            districtActive={districtActive}
            hhPatio={hhPatio}
            hhRoof={hhRoof}
            onEventClick={handleEventClick}
          />
        </div>

        <DistrictPanel
          districtActive={districtActive}
          onDistrictClick={toggleDistrict}
          districtCounts={districtCounts}
        />
      </div>

      <Footer totalEvents={allEventsRaw.length} />
      <Toast message={toastMsg} visible={toastVisible} onHide={() => setToastVisible(false)} />
    </div>
  );
}
