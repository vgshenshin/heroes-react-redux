import {useHttp} from '../../hooks/http.hook';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';

import { heroesFetching, heroesFetched, heroesFetchingError, fetchFilters } from '../../actions';

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
	const [ hero, setHero ] = useState(null);

	const { register, reset, formState: { errors, isSubmitSuccessful }, handleSubmit } = useForm();

	const { heroes } = useSelector(state => state.heroes);
	const { filters } = useSelector(state => state.filters);
	const dispatch = useDispatch();
	const {request} = useHttp();

	useEffect(() => {
		dispatch(fetchFilters(request));

        // eslint-disable-next-line
    }, []);

	const onSubmit = data => { 
		data = {
			id: uuidv4(),
			...data
		}
		setHero(data)
	}


	useEffect(() => {
		reset({ 
			name: '',
			description: '',
			element: ''
		});
		// eslint-disable-next-line
	  }, [isSubmitSuccessful]);

	useEffect(() => {

		if (!hero) return;

		const json = JSON.stringify(hero);

		dispatch(heroesFetching());
		request(`http://localhost:3001/heroes`, 'POST', json)
			.then(data => dispatch(heroesFetched([...heroes, data])))  
				// {id: 'e29016dd-ff22-40e8-abf9-fad735cd70af', name: 'test', description: 'tert', element: 'fire'}
			.catch(() => dispatch(heroesFetchingError()))

		// eslint-disable-next-line
	}, [hero])

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="border p-4 shadow-lg rounded">
			<div className="mb-3">
				<label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
				<input 
					{...register("name", { required: true })} 
					placeholder="Как меня зовут?"
					className="form-control"
					aria-invalid={errors.name ? "true" : "false"}
					/>
					{errors.name?.type === 'required' && <p role="alert">Name is required</p>}
			</div>

			<div className="mb-3">
				<label htmlFor="text" className="form-label fs-4">Описание</label>
				<textarea
					{...register("description", { required: true })}
					className="form-control" 
					placeholder="Что я умею?"
					style={{"height": '130px'}}
					aria-invalid={errors.description ? "true" : "false"}
					/>
					{errors.description?.type === 'required' && <p role="alert">Description is required</p>}
			</div>

			<div className="mb-3">
				<label htmlFor="element" className="form-label">Выбрать элемент героя</label>
				<select 
					{...register("element", { required: "select one option" })}
					className="form-select"
				>
					<option value="" >Я владею элементом...</option>
					{
						filters.slice(1).map(({name, text}, i) => <option key={i} value={name}>{text}</option>)
					}
				</select>
				{errors.element && <p style={{color:'red'}}> {errors.element.message}</p> }
			</div>

			<button type="submit" className="btn btn-primary">Создать</button>
		</form>
	)
}

export default HeroesAddForm;