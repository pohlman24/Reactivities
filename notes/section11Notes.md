### GOAL 
- forms with Formik
    - most popular forms library for react rn
- validation with Formik/Yup
- create reusable form inputs 

### Form changes
- will remove a lot of extra code that we dont need now with formik 

## Validation 
- install Yup and set up a validationScheme 
```
  const validationScheme = Yup.object({
	title: Yup.string().required('The activity title is required')
  })
```
- will add validation by adding the ErrorMessage with the matching name.
    - added FormFiled just to add spacing between Fields
```
<FormField>
    <Field placeholder="Title" name='title' />	
    <ErrorMessage name='title' 
        render={error => <Label basic color='red' content={error}/>}
    />
</FormField>
```

## Creating reusable text input Fields
- to create reusable Textinputs use the useField hook from formik
    - `const [field, meta] = useField(props.name);` 
        - meta will keep track of info like if the filed has been touched and if there is an error (coming from the validation scheme we  setup)
        - you use the `[...props]` & `[...field]` on the actual field. props
        - props could be `name` or `placeholder` or any other attribute from the componenet. T
            - The input jsx tag has a name and placeholder property and by passing the `[...props]` it will automatticaly map those to them, if we wanted to access any other properpy we would need to include it in the props
 - final output in form `<MyTextInput name='title' placeholder='title'/>`

## Creating reusable text area input
- exact same as text input just change `input` to `textarea`

## Creating reusable Select Inputs
- similar but instead of `input` tag use the `Select` one from semantic-UI and cant just spread the props
- also need to add the `helpers` destrucutre var to the useField() hook
- also need to pass in options to it when you use the component, best practice to make a ts/js file and export an array of the options
```
<Select
    clearable
    options={props.options}     
    value={field.value || null}
    onChange={(_, d) => helpers.setValue(d.value)}
    onBlur={() => helpers.setTouched(true)}
    placeholder={props.placeholder}
/>
```

## Create reusable Date picker
- all browsers have their own date picker UI so we will be inputing one from online to make sure its standardize across all browsers
- `npm install react-datepicker`
- need to add styleing sheet import at the index.tsx 
- set up similar to the Select input where you need to specificy the onChange and selected
- will also need to import the props for it so that you can use all the premade props
    - will cast it to a partial class like `Partial<ReactDatePickerProps>` so that it makes all the props optional. 
```
<ReactDatePicker 
    {...field}
    {...props}
    selected={(field.value && new Date(field.value)) || null}
    onChange={value => helpers.setValue(value)}
/>
```
- need to go and update code
    - Activity model is now using the JS Date object | null for the date filed 
    - anywhere `activity.date` is being called we need to use the bang `!` operator to ignore the possibly undefined warning
    - need to import date-fns and use that to style our Date object and as a string using `format(activity.date!, 'dd MMM yyyy h:mm aa')`