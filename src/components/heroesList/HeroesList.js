import {useHttp} from '../../hooks/http.hook';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import { fetchHeroes } from '../../actions';
import { heroDelete, heroesFetchingError } from './heroesSlice';

import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента: (готово)
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

	// мемоизирует значения в стейте, чтобы не было ререндера при получении одного и того же значения
	// например фильтра 'all'

	const filteredHeroesSelector = createSelector(
		(state) => state.filters.activeFilter,
		(state) => state.heroes.heroes,
		(filter, heroes) => filter === 'all' ? heroes : heroes.filter(({element}) => element === filter)
	)

	const filteredHeroes = useSelector(filteredHeroesSelector);
	const {  heroesLoadingStatus } = useSelector(state => state.heroes);
	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		dispatch(fetchHeroes(request));
		// dispatch(heroesFetching());
		// request("http://localhost:3001/heroes")
		// .then(data => dispatch(heroesFetched(data)))
		// .catch(() => dispatch(heroesFetchingError()))
		
		// eslint-disable-next-line
	}, []);

	const onDelete = (id) => {
		request(`http://localhost:3001/heroes/${id}`, 'DELETE')
			.then(() => dispatch(heroDelete(id)))
			.catch(() => dispatch(heroesFetchingError()))
	}

	if (heroesLoadingStatus === "loading") {
		return <Spinner/>;
	} else if (heroesLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>
	}

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
			return <h5 className="text-center mt-5">Героев пока нет</h5>
		}

		return arr.map(({id, ...props}) => {
			return <HeroesListItem key={id} {...props} onDelete={() => onDelete(id)} />
		})
	}

	const elements = renderHeroesList(filteredHeroes);
	return (
		<ul>
			{elements}
		</ul>
	)
}

export default HeroesList;