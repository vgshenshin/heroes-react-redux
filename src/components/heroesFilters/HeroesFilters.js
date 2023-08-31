import {useHttp} from '../../hooks/http.hook';

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { fetchFilters } from '../../actions';
import { activeFilterChanged } from './filtersSlice';
import Spinner from '../spinner/Spinner';


// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

	const { filters, activeFilter, filtersLoadingStatus } = useSelector(state => state.filters);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(fetchFilters(request));

        // eslint-disable-next-line
    }, []);

	if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки фильтров</h5>
    }

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">
					{ 
						filters.map(({name, text, className}, i) => {
							return (
								<button 
									key={i} 
									onClick={ () => dispatch(activeFilterChanged(name)) } 
									className={cn('btn', className, {'active': name === activeFilter})}>
										{text}
								</button>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

export default HeroesFilters;