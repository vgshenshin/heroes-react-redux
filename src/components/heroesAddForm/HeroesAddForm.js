import {useHttp} from '../../hooks/http.hook';

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import store from "../../store";

import { v4 as uuidv4 } from 'uuid';

import { fetchFilters, selectAll } from '../heroesFilters/filtersSlice';
import { heroAdd } from '../heroesList/heroesSlice';

const HeroesAddForm = () => {
	const [ hero, setHero ] = useState(null);

	const { register, reset, formState: { errors, isSubmitSuccessful }, handleSubmit } = useForm();

	const {filtersLoadingStatus} = useSelector(state => state.filters);
	const filters = selectAll(store.getState());
	const dispatch = useDispatch();
	const {request} = useHttp();

	useEffect(() => {
		dispatch(fetchFilters());

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

		const formData = new FormData();

		for (const key in hero) {
		  if (hero.hasOwnProperty(key)) {
			formData.append(key, hero[key]);
		  }
		}
		
		//  http://localhost:3001/heroes
		request(`https://script.google.com/macros/s/AKfycbxWyBvNIWyMu00F0p4ThA7-NooEhr1_LFywTn90NCcf7oIg_q-q7Vb2JMqoMXc8ei0M5A/exec`, 'POST', formData)
			.then(dispatch(heroAdd(hero)));
				// {id: 'e29016dd-ff22-40e8-abf9-fad735cd70af', name: 'test', description: 'tert', element: 'fire'}

		// eslint-disable-next-line
	}, [hero])

	const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }

		if (filters && filters.length > 0 ) {
            return filters.map(({name, text}) => {
                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{text}</option>
            })
        }
	}

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
						renderFilters(filters, filtersLoadingStatus)
					}
				</select>
				{errors.element && <p style={{color:'red'}}> {errors.element.message}</p> }
			</div>

			<button type="submit" className="btn btn-primary">Создать</button>
		</form>
	)
}

export default HeroesAddForm;