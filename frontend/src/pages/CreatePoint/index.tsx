import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'
import api from '../../services/api';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';

import Dropzone from '../../components/Dropzone';

//leaftleft
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

// css
import './style.css';

import logo from '../../assets/logo.svg';

// Sempre que criamos um estado para um array ou um objeto precisamos manualmente informar o tipo da variavel

interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
                                /*Indica o tipo de variável que vai ser armazenado*/
    const [items, setItem] = useState<Item[]>([]);
    const [ufs, setUF] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    const [inititalPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedUf, setSelectUF] = useState('0');
    const [selectedCity, setSelectCity] = useState('0');
    const [selectedPostion, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [selectedFile, setSelectedFile] = useState<File>();


    const history = useHistory();

    // Qual função quero executar e quando (determinado quando o estado mudar ou algum outra condição)
    useEffect(() => {
        api.get('items').then(response => {
            setItem(response.data);
        }) 
    }, []);

    // IBGE
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const initials = response.data.map(uf => uf.sigla);

            setUF(initials);
        })
    }, [])

    useEffect(() => {
        if(selectedUf === '0'){
            return
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios
        `).then(response => {
            const cityNames = response.data.map(city => city.nome);

            setCities(cityNames);
        })
    }, [selectedUf])

    // Posição inicial
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            const {latitude, longitude} = position.coords;
            setInitialPosition([
                latitude,
                longitude
            ])

        })
    }, [])

    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;

        setSelectUF(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;

        setSelectCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent){
        // console.log(event.latlng);
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng,
        ]
    )}

    function handleInputChange(event: ChangeEvent<HTMLInputElement> ) {
        // Retorna a referencia do input
        // console.log(event.target);
        const {name, value} = event.target;
        setFormData({
            ...formData,
            [name]: value,   
        })
    }

    function handleSelectItem(id: number) {
        // console.log(id);
        const alreadySelected = selectedItems.findIndex(item => item === id);
        if(alreadySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id ]);
        }
    }


    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        // console.log('oi');
        // console.log(selectedFile);

        const { name, email, whatsapp} = formData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPostion;
        const items = selectedItems;

        const data = new FormData();
    
        data.append('name', name)
        data.append('email', email)
        data.append('whatsapp', whatsapp)
        data.append('uf', uf)
        data.append('city', city)
        data.append('latitude', String(latitude))
        data.append('longitude', String(longitude))
        data.append('items', items.join(','))
        
        if(selectedFile){
            data.append('image', selectedFile);
        }
        

        // const data = {
        //     name, 
        //     email,
        //     whatsapp,
        //     uf,
        //     city,
        //     latitude,
        //     longitude,
        //     items,
        // }

        await api.post('points', data)

        alert('ponto de coleta criado')

        history.push('/');
    }

    return (
        <div id="page-create-point">
            <div className="content">
                <header>
                    <img src={logo} alt="Ecoleta" />

                    <Link to="/">
                        <FiArrowLeft />
                        Voltar para home
                    </Link>
                </header>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastro do <br />ponto de Coleta</h1>

                    <Dropzone onFileUpload={setSelectedFile}/>
                    {/* Cadas conjunto de campos do form sera um fieldSet */}
                    <fieldset>
                        <legend>
                            <h2>Dados</h2>
                        </legend>
                        <div className="field">
                            <label htmlFor="name">Nome da entidade</label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    onChange={handleInputChange}/>
                            </div>

                            <div className="field">
                                <label htmlFor="whatsapp">Whatsapp</label>
                                <input 
                                    type="text" 
                                    name="whatsapp" 
                                    id="whatsapp"
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>
                    </fieldset>
                    
                    {/* MAP + cidade */}
                    <fieldset>
                        <legend>
                            <h2>Endereço</h2>
                            <span>Selecione o endereço de coleta</span>
                        </legend>

                        {/* <Map center={[-20.7179278, -47.8723759]} zoom={15} onClick={handleMapClick}> */}
                        <Map center={inititalPosition} zoom={15} onClick={handleMapClick}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* <Marker position={[-20.7179278, -47.8723759]}> */}
                            {/* <Marker position={inititalPosition}> */}
                            <Marker position={selectedPostion}>
                                <Popup>
                                    Ecoleta
                                </Popup>
                            </Marker>
                        </Map>

                        <div className="field-group">
                            <div className="field">
                                <label htmlFor="uf">Estado (UF)</label>
                                <select 
                                    name="uf" 
                                    id="uf" 
                                    value={selectedUf}
                                    onChange={handleSelectUf}>
                                    <option value="0">Selecione uma UF</option>
                                    {ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="field">
                                <label htmlFor="city">Cidade</label>
                                <select 
                                    name="city" 
                                    id="city"
                                    value={selectedCity} 
                                    onChange={handleSelectCity}>
                                    <option value="0">Selecione uma cidade</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* ITEMS DE COLETA */}
                    <fieldset>
                        <legend>
                            <h2>Ítems de Coleta</h2>
                        </legend>

                        <ul className="items-grid">
                            {items.map(item => (
                                                        //Sempre que quiser passar um parametro como referencia para função, criase uma arrowfunction
                                <li 
                                    key={item.id} 
                                    onClick={() => handleSelectItem(item.id)}
                                    className={selectedItems.includes(item.id) ? 'selected' : ''}
                                >
                                    <img src={item.image_url} alt="{item.title}" />
                                    <span>{item.title}</span>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <button type="submit">Cadastrar ponto de coleta</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePoint;