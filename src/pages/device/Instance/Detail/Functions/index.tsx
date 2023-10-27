/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2023-07-13 11:36:00
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2023-10-27 14:47:28
 * @Description:
 */
import { Card, Tabs, Tooltip } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import type { FunctionMetadata } from '@/pages/device/Product/typings';
import FnForm from './form';
import AModel from './AdvancedMode';
// import { useDomFullHeight } from '@/hooks';
import Empty from '@/pages/device/components/Empty';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const Functions = () => {
  const functionList = JSON.parse(InstanceModel.detail.metadata || '{}')
    .functions as FunctionMetadata[];

  // const { minHeight } = useDomFullHeight(`.device-detail-function`);

  return (
    <Card className={'device-detail-function'}>
      {functionList && functionList.length ? (
        <Tabs>
          <Tabs.TabPane tab={'精简模式'} key={1}>
            <>
              <div style={{ paddingBottom: 12 }}>
                <ExclamationCircleOutlined style={{ marginRight: 12 }} />
                精简模式下参数只支持输入框的方式录入
              </div>
              <Tabs tabPosition="left">
                {functionList &&
                  functionList.map((fn) => {
                    return (
                      <Tabs.TabPane
                        tab={
                          <Tooltip placement="topLeft" title={fn.name}>
                            <div className="ellipsis">{fn.name}</div>
                          </Tooltip>
                        }
                        // tab={fn.name}
                        key={fn.id}
                      >
                        <FnForm data={fn} />
                      </Tabs.TabPane>
                    );
                  })}
              </Tabs>
            </>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'高级模式'} key={2}>
            <Tabs tabPosition="left">
              {functionList &&
                functionList.map((fn) => {
                  return (
                    <Tabs.TabPane
                      tab={
                        <Tooltip placement="topLeft" title={fn.name}>
                          <div className="ellipsis">{fn.name}</div>
                        </Tooltip>
                      }
                      key={fn.id}
                    >
                      <AModel data={fn} />
                    </Tabs.TabPane>
                  );
                })}
            </Tabs>
          </Tabs.TabPane>
        </Tabs>
      ) : (
        <div>
          <Empty />
        </div>
      )}
    </Card>
  );
};
export default Functions;
