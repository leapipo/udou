import {
  Button,
  Drawer as AntDrawer,
  Form,
  Input,
  message,
  Select,
  Divider,
  List,
  Typography,
  Tooltip,
  Popconfirm,
  ConfigProvider,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Dot } from './DeleteTrackable.style';
import { useState } from 'react';
import { getTrackables } from '../../../../common/fetch-functions';

function DeleteTrackable({ onClose, open, trackables, setTrackables }) {
  const trackedItems = trackables;

  const confirm = (id) => {
    console.log(id);

    deleteTrack(id);
  };

  const cancel = (e) => {
    console.log(e);
    message.error('Trackable is retained');
  };

  // trackable is deleted but panel shows change only after reload

  async function deleteTrack(id) {
    let options = {
      method: 'DELETE',
    };
    try {
      let response = await fetch(`/trackables/${id}`, options);
      if (response.ok) {
        message.success('Trackable was deleted');
        let data = await getTrackables();
        setTrackables(data);
      } else {
        console.log(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.log(`Server error: ${err.message}`);
    }
  }

  return (
    <>
      <AntDrawer
        title='Delete trackable'
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Divider orientation='left'>Trackables</Divider>
        <List
          bordered
          dataSource={trackedItems}
          renderItem={(trackable) => (
            <List.Item key={trackable.id}>
              <Dot color={trackable.color} />
              {trackable.name}
              <Tooltip title='delete'>
                <Popconfirm
                  title='Are you sure to delete this trackable?'
                  onConfirm={() => confirm(trackable.id)}
                  onCancel={cancel}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button type='primary' icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Tooltip>
            </List.Item>
          )}
        />
      </AntDrawer>
    </>
  );
}

export default DeleteTrackable;

// Use AntDrawer like in AddTrackable component
// Also button below Add trackable button (delete trackable)
// See there a list of all trackables
// Probably possible to use getTrackables (from fetch file)
// Possibility to delete some with button
// For deleting: find trackable id and write DELETE req
// Delete trackable_id from every day entry (loop over every day entry in entries table) in db
// Delete whole trackable entry in trackables in db
