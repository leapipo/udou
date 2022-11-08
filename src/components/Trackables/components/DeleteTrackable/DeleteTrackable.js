import {
  Button,
  Drawer as AntDrawer,
  message,
  Divider,
  List,
  Tooltip,
  Popconfirm,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Dot } from './DeleteTrackable.style';
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
            <List.Item
              key={trackable.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '14, 1fr',
                gridTemplateRows: '1, 1fr',
              }}
            >
              <Dot
                color={trackable.color}
                style={{ gridColumnStart: 1, gridColumnEnd: 2 }}
              />
              <div style={{ gridColumnStart: 2, gridColumnEnd: 3 }}>
                {trackable.name}
              </div>
              <Tooltip title='delete'>
                <Popconfirm
                  title='Are you sure to delete this trackable?'
                  onConfirm={() => confirm(trackable.id)}
                  onCancel={cancel}
                  okText='Yes'
                  cancelText='No'
                >
                  <Button
                    type='primary'
                    icon={<DeleteOutlined />}
                    style={{ gridColumnStart: 13, gridColumnEnd: 14 }}
                  >
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
