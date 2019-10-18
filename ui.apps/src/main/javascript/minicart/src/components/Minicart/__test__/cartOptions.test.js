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
import { render } from '@testing-library/react';

import CartOptions from '../cartOptions';
import { CartProvider } from '../../../utils/state';

describe('<CartOptions>', () => {
    it('renders the component properly', () => {
        const initialState = {
            cartId: '123ABC',
            editItem: {
                id: '123',
                quantity: 2,
                product: {
                    name: 'Dummy product',
                    price: {
                        regularPrice: {
                            amount: {
                                value: 100,
                                currency: 'USD'
                            }
                        }
                    }
                }
            }
        };

        const { asFragment } = render(
            <CartProvider initialState={initialState} reducerFactory={() => state => state}>
                <CartOptions />
            </CartProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
