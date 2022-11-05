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
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Dot } from './DeleteTrackable.style';
import { useState } from 'react';

function DeleteTrackable({ onClose, open, trackables }) {
  const trackedItems = trackables;
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
                <Button type='primary' icon={<DeleteOutlined />}>
                  Delete
                </Button>
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
