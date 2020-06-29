/*******************************************************************************
 *
 *    Copyright 2019 Adobe. All rights reserved.
 *    This file is licensed to you under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License. You may obtain a copy
 *    of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software distributed under
 *    the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 *    OF ANY KIND, either express or implied. See the License for the specific language
 *    governing permissions and limitations under the License.
 *
 ******************************************************************************/

import React from 'react';
import { MockedProvider } from '@apollo/react-testing';
import { render, waitForElement } from '@testing-library/react';

import QUERY_CUSTOMER_ORDERS from '../../../queries/query_customer_orders.graphql';

import CustomerOrders from '../customerOrders';

const queryEmptyMock = [
    {
        request: {
            query: QUERY_CUSTOMER_ORDERS
        },
        result: {
            data: {
                customerOrders: {
                    items: []
                }
            }
        }
    }
];

const queryFillMock = [
    {
        request: {
            query: QUERY_CUSTOMER_ORDERS
        },
        result: {
            data: {
                customerOrders: {
                    items: [
                        {
                            order_number: '000000002',
                            id: 1,
                            created_at: '2019-02-21 00:24:34',
                            grand_total: 36.39,
                            status: 'processing'
                        },
                        {
                            order_number: '000000001',
                            id: 2,
                            created_at: '2019-02-21 00:24:35',
                            grand_total: 39.64,
                            status: 'closed'
                        }
                    ]
                }
            }
        }
    }
];

const queryNotAuthMock = [
    {
        request: {
            query: QUERY_CUSTOMER_ORDERS
        },
        result: {
            errors: [
                {
                    message: "The current customer isn't authorized.",
                    extensions: {
                        category: 'graphql-authorization'
                    },
                    locations: [
                        {
                            line: 7,
                            column: 5
                        }
                    ],
                    path: ['customerOrders']
                }
            ],
            data: {
                customerOrders: null
            }
        }
    }
];

describe('<CustomerOrders />', () => {
    it('should return empty Customer Orders message', async () => {
        const { getByLabelText } = render(
            <MockedProvider mocks={queryEmptyMock} addTypename={false}>
                <div>
                    <CustomerOrders />;
                </div>
            </MockedProvider>
        );

        const customerOrdersMessage = await waitForElement(() => getByLabelText('Customer no Orders'));

        expect(customerOrdersMessage.textContent).toEqual('You have placed no orders yet.');
    });

    it('should return Customer Orders table with exacly two rows', async () => {
        const { getByLabelText } = render(
            <MockedProvider mocks={queryFillMock} addTypename={false}>
                <div>
                    <CustomerOrders />;
                </div>
            </MockedProvider>
        );

        const customerOrdersNode = await waitForElement(() => getByLabelText('Customer Orders'));
        const customerOrderItems = customerOrdersNode.getElementsByClassName(
            'MuiTableCell-root MuiTableCell-body MuiTableCell-alignRight'
        );

        expect(customerOrderItems.item(0).textContent).toEqual('2019-02-21');
        expect(customerOrderItems.item(1).textContent).toEqual('36.39$');
        expect(customerOrderItems.item(2).textContent).toEqual('processing');
        expect(customerOrderItems.item(3).textContent).toEqual('2019-02-21');
        expect(customerOrderItems.item(4).textContent).toEqual('39.64$');
        expect(customerOrderItems.item(5).textContent).toEqual('closed');
        expect(customerOrderItems.item(6)).toEqual(null);
    });

    it('should return error retrieving order data', async () => {
        const { getByLabelText } = render(
            <MockedProvider mocks={queryNotAuthMock} addTypename={false}>
                <div>
                    <CustomerOrders />;
                </div>
            </MockedProvider>
        );

        const customerOrdersNode = await waitForElement(() => getByLabelText('Customer Orders'));

        expect(customerOrdersNode.textContent).toEqual('There was an error retrieving order data.');
    });
});
