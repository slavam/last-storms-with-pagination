import { useForm, Controller } from "react-hook-form"
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as Yup from 'yup'
import Select from "react-select"
import { useCreateStormMutation } from '../api/apiSlice'
import { useNavigate } from 'react-router-dom'

export const NewStormBulletin = ()=>{
  const navigate = useNavigate()
  const [createStorm] = useCreateStormMutation()
  const synoptics = [
    {label:'Деревянко Н.Н.',value:'Деревянко Н.Н.'},
    {label:'Маренкова Н.В.',value:'Маренкова Н.В.'},
    {label:'Соколова Т.Е.',value:'Соколова Т.Е.'},
    {label:'Бойко Л.Н.',value:'Бойко Л.Н.'}
  ]
  const chiefs = [
    {label:'Кияненко М.А.',value:'М.А. Кияненко'},
    {label:'Лукьяненко М.Б.',value:'М.Б. Лукьяненко'},
    {label:'Стец Н.В.',value:'Н.В. Стец'},
    {label:'Арамелева О.В.',value:'О.В. Арамелева'},
  ]
  // const validationSchema = Yup.object().shape({
  //   hour: Yup.number().min(0).max(23).required('Hour is required'),
    // storm: Yup.string().required('Text is required'),
  //   reportDate: Yup.string().required('Date is required')
  //     .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Date must be a valid date in the format YYYY-MM-DD')
  // });
  // const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    register,
    control,
    handleSubmit,
    // reset,
    // formState: { errors },
  } = useForm({
    defaultValues: {
      report_date: new Date().toISOString().substr(0, 10),
      storm_hour: new Date().getHours(),
      storm_minute: 0,
      curr_number: 'ШТОРМОВОЕ ПРЕДУПРЕЖДЕНИЕ №',
      storm: '',
      synoptic1: synoptics[0],
      chief: chiefs[0],
    },
    // formOptions
  })

  const onSubmit = (data) => {
    data.synoptic1 = data.synoptic1.value
    data.chief = data.chief.value
    data.bulletin_type = "storm"
    createStorm(data)
    // console.log(data); 
    // reset()
    navigate('/stormBulletins')
  } 

  return (
    <div className="card m-3">
      <h5 className="card-header">Штормовое предупреждение</h5>
      <div className="card-body">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Отчетная дата</label>
              <br/>
              <input type="date" id="report-date" max={new Date().toISOString().substr(0, 10)} {...register("report_date", {valueAsDate: true,})}/>
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Час</label>
              <br/>
              <input type="number" id="hour" max='23' min='0'{...register("storm_hour")}
                />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Минуты</label>
              <br/>
              <input type="number" id="minute" max='59' min='0'{...register("storm_minute")} />
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Заголовок</label>
              <br/>
              <input type="text" style={{width:740+'px'}} id="header" {...register("curr_number")} required/>
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Текст</label>
              <br/>
              <textarea id="storm-text" cols='30' rows='5'{...register("storm")} required/>
              {/* <div className="invalid-feedback">{errors.storm?.message}</div> */}
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Синоптик</label>
              <Controller
                name="synoptic1"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select {...field} options={synoptics} />
                )}
              />
              {/* {errors.synoptic1 && (
                <p className="errorMsg">This is a required field.</p>
              )} */}
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label>Начальник</label>
              <Controller
                name="chief"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select {...field} options={chiefs} />
                )}
              />
              {/* {errors.chief && (
                <p className="errorMsg">This is a required field.</p>
              )} */}
            </div>
          </div>
          {/* register your input into the hook by invoking the "register" function */}
          {/* <input defaultValue="test" {...register("example")} />


          {/* include validation with required or other standard HTML validation rules */}
          {/* <input {...register("exampleRequired", { required: true })} /> */}
          {/* errors will return when field validation fails  */}
          {/* {errors.exampleRequired && <span>This field is required</span>} */}


          <input type="submit" />
        </form>
      </div>
    </div>
  )
}