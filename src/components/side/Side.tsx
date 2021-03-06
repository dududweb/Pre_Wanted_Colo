import * as S from './Side_Style';
import React, { useState, useEffect } from 'react';
import { RELEASE_DATA } from './SideData';
import { useRecoilState } from 'recoil';
import { orderfilteredData, filteredReleaseData } from '../../atom';
import Button from '@components/button/Button';
import axios from 'axios';

export default function Side() {
	const [orderList, setOrderList] = useState<any>();
	const [filteredData, setFiltetedData] = useRecoilState(filteredReleaseData);
	const [orderFilterList, setOrderFilterList] = useRecoilState(orderfilteredData);

	const getSelectedData = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = event.target;
		setFiltetedData({ ...filteredData, [name]: value });
	};
	console.log(filteredData);

	const handleFilterData = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const result = orderList?.filter(
			(el: any) => el.release_status === filteredData.release_status && el.release_type === filteredData.release_type,
		);
		console.log(result);
		setOrderFilterList(result);
	};
	console.log(orderFilterList);

	const getData = async () => {
		axios
			.get('/mockData.json')
			.then((res: any) => {
				setOrderList(res.data.orderlist);
			})
			.catch((error) => setOrderList(error));
	};

	useEffect(() => {
		getData();
	}, []);

	return (
		<S.Side>
			<S.SideInner>
				<S.SideTitle>출고 신청 번호</S.SideTitle>
				<S.Form method="post" onSubmit={handleFilterData}>
					<S.InfoList>
						<S.InfoItemsTitle>출고요청번호:</S.InfoItemsTitle>
						<S.InfoItemsContents>Xl-21212-212</S.InfoItemsContents>
					</S.InfoList>
					<S.InfoList>
						<S.InfoItemsTitle>출고요청 일자</S.InfoItemsTitle>
						<S.InfoItemsContents>2022/02/17</S.InfoItemsContents>
					</S.InfoList>
					{RELEASE_DATA.map((items) => {
						return (
							<S.InfoList key={items.id}>
								<S.InfoItemsTitle>{items.title}:</S.InfoItemsTitle>
								{items.selectItems.length === 1 ? (
									<>
										{items.selectItems.map((selectList) => {
											return <S.InfoItemsContents key={selectList.id}>{selectList.value}</S.InfoItemsContents>;
										})}
									</>
								) : (
									<select name={items.name} onChange={getSelectedData} required>
										{items.selectItems.map((selectList) => {
											return (
												<option value={selectList.value} key={selectList.id}>
													{selectList.value}
												</option>
											);
										})}
									</select>
								)}
							</S.InfoList>
						);
					})}
					<Button type="submit" buttonName="검색" backgroundColor="white" color="blue" margin="0" />
				</S.Form>
			</S.SideInner>
		</S.Side>
	);
}
