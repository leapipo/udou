import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import Entry from './components/Entry/Entry';
import { StyledCollapse, DateBar, Wrapper, Dot } from './Trackables.style';
import { getEntries, getTrackables } from '../../common/fetch-functions';
import AddTrackable from './components/AddTrackable/AddTrackable';
import DeleteTrackable from './components/DeleteTrackable/DeleteTrackable';

const { Panel } = StyledCollapse;

export default function Trackables({ date }) {
  const [dayEntries, setDayEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [trackables, setTrackables] = useState([]);

  // dayEntries is a function from fetch-functions and it is giving us all entries for a specific user from db
  // with getTrackableEntry we can find the id from a specfic trackable
  const getTrackableEntry = (id) =>
    dayEntries.find((entry) => id === entry.trackable_id);

  // !! operator converts an object to boolean
  // isVisible returns a boolean (if the trackable is active or if the trackable as an entry for that day)
  // use: on any day, the trackables list (see in return statement) will contain only active trackables or trackables which are currently inactive but have entries in the past, so the user can still see the old entries
  const isVisible = ({ active, id }) => active || !!getTrackableEntry(id);

  useEffect(() => {
    getEntries(date).then(setDayEntries);
  }, [date]);

  useEffect(() => {
    getTrackables().then(setTrackables);
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };

  // close is the same function for both drawers
  // other than open

  const onClose = () => {
    setOpen(false);
    setOpenDelete(false);
  };

  const showOpenDelete = () => {
    setOpenDelete(true);
  };

  // return statement is everything that is on the left

  return (
    <Wrapper>
      {/* shows date on top */}
      {/* DateBar is showing current day as it is using the dayjs library */}
      <DateBar>{dayjs(date).format('dddd, MMMM D, YYYY')}</DateBar>
      <StyledCollapse bordered={false} defaultActiveKey={[1]}>
        {/* list of trackables with make new entry functionality */}
        {trackables.map(
          (trackable) =>
            // if trackable is visible
            // show panel and entry
            // panel and entry show automatically, user does not have to click on it (both is always there als long as there is a visible trackable)
            // will show trackables list with active trackables or trackables that are currently inactive but have entries in the past, so the user can still see the old entries
            isVisible(trackable) && (
              <Panel
                header={trackable.name}
                key={trackable.id + date}
                extra={<Dot color={trackable.color} />}
              >
                {/* What will be written in between Panel will show above entry but not next to the colored dot 
                but Panel can only have 3 "properties"
                extra is already used, but maybe use a div and have color dot and delete button inside (or new component, see DeleteTrackable.js with AntDrawer)
                */}
                <Entry
                  // trackable is passed as a prop to Entry component
                  // Entry for trackable on a specific day (not relevant for delete functionality)
                  // But than I won't need it for adding the delete funtion
                  // Delete could happen in this file (panel) or in DeleteTrackable.js
                  trackable={trackable}
                  // id of specific entry
                  entry={getTrackableEntry(trackable.id)}
                  date={date}
                  onChange={getEntries}
                  setDayEntries={setDayEntries}
                />
              </Panel>
            )
        )}
      </StyledCollapse>

      {/* functionality for actually adding a new trackable */}
      <AddTrackable
        open={open}
        onClose={onClose}
        setTrackables={setTrackables}
      />
      {/* Button "Add trackable" */}
      {/* onClick executes showDrawer function */}
      <Button type='dashed' onClick={showDrawer}>
        Add trackable
      </Button>
      <DeleteTrackable
        open={openDelete}
        onClose={onClose}
        trackables={trackables}
        setTrackables={setTrackables}
      />
      <Button type='dashed' onClick={showOpenDelete}>
        Manage trackables
      </Button>
    </Wrapper>
  );
}
