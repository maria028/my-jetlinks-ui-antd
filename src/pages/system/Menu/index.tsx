// 菜单管理
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@jetlinks/pro-table';
import ProTable from '@jetlinks/pro-table';
import { useRef, useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import { Button, Tooltip } from 'antd';
import {
  DeleteOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { useHistory, useModel } from 'umi';
import SearchComponent from '@/components/SearchComponent';
import Service from './service';
import type { MenuItem } from './typing';
import moment from 'moment';
import { getMenuPathByCode, getMenuPathByParams, MENUS_CODE } from '@/utils/menu';
import { PermissionButton } from '@/components';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

export const service = new Service('menu');

type ModelType = {
  visible: boolean;
  current: Partial<MenuItem>;
  parentId: string | undefined;
};

export const State = model<ModelType>({
  visible: false,
  current: {},
  parentId: undefined,
});

export default observer(() => {
  const actionRef = useRef<ActionType>();
  const intl = useIntl();
  const { minHeight } = useDomFullHeight(`.menu`, 24);
  const [param, setParam] = useState<any>({});
  const history = useHistory();
  const { permission } = PermissionButton.usePermission('system/Menu');
  const { initialState } = useModel('@@initialState');
  const lastIndex = useRef(0);

  const deleteItem = async (id: string) => {
    const response: any = await service.remove(id);
    if (response.status === 200) {
      onlyMessage(
        intl.formatMessage({
          id: 'pages.data.option.success',
          defaultMessage: '操作成功!',
        }),
      );
    }
    actionRef.current?.reload();
  };

  /**
   * 跳转详情页
   * @param id
   * @param pId
   * @param basePath
   */
  const pageJump = (id?: string, pId?: string, basePath?: string, record?: MenuItem) => {
    const params = new URLSearchParams();
    params.set('pId', pId || '');
    params.set('basePath', basePath || '');
    // 新增
    if (!id) {
      if (record) {
        // 新增子级,并且有子级的情况下
        if (record.children && record.children.length) {
          params.set('sortIndex', record.children[record.children.length - 1].sortIndex + 1 + '');
        } else {
          params.set('sortIndex', '1');
        }
      } else {
        params.set('sortIndex', lastIndex.current + '');
      }
    }
    // 跳转详情
    history.push(
      `${getMenuPathByParams(MENUS_CODE['system/Menu/Detail'], id)}?${params.toString()}`,
    );
  };

  const columns: ProColumns<MenuItem>[] = [
    {
      title: intl.formatMessage({
        id: 'page.system.menu.encoding',
        defaultMessage: '编码',
      }),
      width: 300,
      dataIndex: 'code',
      fixed: 'left',
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.name',
        defaultMessage: '名称',
      }),
      width: 220,
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.url',
        defaultMessage: '页面地址',
      }),
      dataIndex: 'url',
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.sort',
        defaultMessage: '排序',
      }),
      width: 80,
      dataIndex: 'sortIndex',
      valueType: 'digit',
      render: (_, record) => {
        return record.sortIndex;
      },
    },
    {
      title: intl.formatMessage({
        id: 'page.system.menu.describe',
        defaultMessage: '说明',
      }),
      width: 200,
      dataIndex: 'describe',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.createTime',
        defaultMessage: '创建时间',
      }),
      width: 180,
      valueType: 'dateTime',
      dataIndex: 'createTime',
      render: (_, record) => {
        return record.createTime ? moment(record.createTime).format('YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.data.option',
        defaultMessage: '操作',
      }),
      valueType: 'option',
      width: 140,
      align: 'left',
      fixed: 'right',
      render: (_, record) => [
        <Button
          type="link"
          key="view"
          style={{ padding: 0 }}
          onClick={() => {
            pageJump(record.id, record.parentId || '', '', record);
          }}
        >
          <Tooltip
            title={intl.formatMessage({
              id: 'pages.data.option.view',
              defaultMessage: '查看',
            })}
          >
            <SearchOutlined />
          </Tooltip>
        </Button>,
        <PermissionButton
          type="link"
          style={{ padding: 0 }}
          key="editable"
          isPermission={permission.add}
          tooltip={{
            title: intl.formatMessage({
              id: 'page.system.menu.table.addChildren',
              defaultMessage: '新增子菜单',
            }),
          }}
          onClick={() => {
            State.current = {
              parentId: record.id,
            };
            // State.visible = true;
            pageJump('', record.id, record.url, record);
          }}
        >
          <PlusCircleOutlined />
        </PermissionButton>,
        <PermissionButton
          key="delete"
          type="link"
          style={{ padding: 0 }}
          isPermission={permission.delete}
          popConfirm={{
            title: intl.formatMessage({
              id: 'page.system.menu.table.delete',
              defaultMessage: '是否删除该菜单',
            }),
            onConfirm() {
              deleteItem(record.id);
            },
          }}
          tooltip={{
            title: intl.formatMessage({
              id: 'pages.data.option.delete',
              defaultMessage: '删除',
            }),
          }}
        >
          <DeleteOutlined />
        </PermissionButton>,
      ],
    },
  ];

  /**
   * table 查询参数
   * @param data
   */
  const searchFn = (data: any) => {
    setParam(data);
  };

  // const modalCancel = () => {
  //   State.current = {};
  //   State.visible = false;
  //   form.resetFields();
  // };

  // const saveData = async () => {
  //   const formData = await form.validateFields();
  //   if (formData) {
  //     const _data = {
  //       ...formData,
  //       parentId: State.current.parentId,
  //     };
  //     const response: any = await service.save(_data);
  //     if (response.status === 200) {
  //       message.success('操作成功！');
  //       modalCancel();
  //       pageJump(response.result.id);
  //     } else {
  //       message.error('操作成功！');
  //     }
  //   }
  // };

  return (
    <PageContainer>
      <SearchComponent
        field={columns}
        target="menu"
        onSearch={searchFn}
        // onReset={() => {
        //   // 重置分页及搜索参数
        //   actionRef.current?.reset?.();
        //   searchFn({});
        // }}
      />
      <ProTable<MenuItem>
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
        columnEmptyText={''}
        scroll={{ x: 1366 }}
        tableClassName={'menu'}
        tableStyle={{ minHeight }}
        pagination={false}
        search={false}
        params={param}
        request={async (params) => {
          console.log(params);
          //过滤非集成的菜单
          const item = {
            terms: [
              {
                terms: [
                  {
                    column: 'owner',
                    termType: 'eq',
                    value: 'iot',
                  },
                  {
                    column: 'owner',
                    termType: 'isnull',
                    value: '1',
                    type: 'or',
                  },
                ],
              },
            ],
          };
          const response = await service.queryMenuThree({
            ...params,
            terms: params.terms && params.length !== 0 ? [...param.terms, item] : [item],
            sorts: [{ name: 'sortIndex', order: 'asc' }],
            paging: false,
          });
          const lastItem = response.result[response.result.length - 1];

          lastIndex.current = lastItem ? lastItem.sortIndex + 1 : 1;
          return {
            code: response.message,
            result: {
              data: response.result?.filter(
                (i: any) => !['message-subscribe', 'account-center'].includes(i.code),
              ),
              pageIndex: 0,
              pageSize: 0,
              total: 0,
            },
            status: response.status,
          };
        }}
        headerTitle={[
          <PermissionButton
            isPermission={permission.add}
            onClick={() => {
              pageJump();
            }}
            key="button"
            icon={<PlusOutlined />}
            type="primary"
          >
            {intl.formatMessage({
              id: 'pages.data.option.add',
              defaultMessage: '新增',
            })}
          </PermissionButton>,
          initialState?.currentUser?.user?.username === 'admin' && (
            <PermissionButton
              style={{ marginLeft: 12 }}
              isPermission={true}
              onClick={() => {
                history.push(getMenuPathByCode('system/Menu/Setting'));
              }}
            >
              菜单配置
            </PermissionButton>
          ),
        ]}
      />
    </PageContainer>
  );
});
