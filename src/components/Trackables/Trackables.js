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

  return (
    <Wrapper>
      {/* DateBar is showing current day as it is using the dayjs library */}
      <DateBar>{dayjs(date).format('dddd, MMMM D, YYYY')}</DateBar>
      <StyledCollapse bordered={false} defaultActiveKey={[1]}>
        {/* list of trackables with new entry functionality */}
        {trackables.map(
          (trackable) =>
            // if trackable is visible
            // show panel and entry
            isVisible(trackable) && (
              <Panel
                header={trackable.name}
                key={trackable.id + date}
                extra={<Dot color={trackable.color} />}
              >
                <Entry
                  // trackable is passed as a prop to Entry component
                  trackable={trackable}
                  entry={getTrackableEntry(trackable.id)}
                  date={date}
                  onChange={getEntries}
                  setDayEntries={setDayEntries}
                />
              </Panel>
            )
        )}
      </StyledCollapse>

      {/* functionality for adding new trackable */}
      <AddTrackable
        open={open}
        onClose={onClose}
        setTrackables={setTrackables}
      />
      {/* Button "Add trackable" */}
      {/* onClick executes showDrawer function */}
      <Button
        type='dashed'
        onClick={showDrawer}
        style={{ marginBottom: '5px' }}
      >
        Add trackable
      </Button>
      <DeleteTrackable
        open={openDelete}
        onClose={onClose}
        trackables={trackables}
        setTrackables={setTrackables}
      />
      <Button type='dashed' onClick={showOpenDelete}>
        Delete trackables
      </Button>
    </Wrapper>
  );
}
