import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { loadCourses, saveCourse } from "../../redux/actions/courseActions";
import { loadAuthors } from "../../redux/actions/authorActions";

import CourseForm from "./CourseForm";
import Spinner from "../common/Spinner";
import { newCourse } from "../../../tools/mockData";

import PropTypes from "prop-types";
import { toast } from "react-toastify";

function ManageCoursePage(props) {
    const { courses, authors, loadAuthors, loadCourses, saveCourse, history } = props
    const [course, setCourse] = useState({ ...props.course });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Use Effect Hook
    useEffect(() => {
        if (courses.length === 0) {
            loadCourses().catch(error => {
                alert("Loading Courses Failed" + error);
            });
        } else {
            setCourse({ ...props.course });
        }

        if (authors.length === 0) {
            loadAuthors().catch(error => {
                alert("Loading Authors Failed" + error);
            });
        }
    }, [props.course]);

    function handleChange(event) {
        const { name, value } = event.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: name === "authorId" ? parseInt(value, 10) : value
        }))
    }

    // Save Course Function
    function handleSave(event) {
        event.preventDefault();
        setSaving(true);
        saveCourse(course).then(() => {
            toast.success("Course Saved");
            history.push("/courses")
        });
    }


    return (
        authors.length === 0 || courses.length === 0 ? (<Spinner />) :
            (<CourseForm course={course} errors={errors} authors={authors} saving={saving}
                onChange={handleChange} onSave={handleSave}>
            </CourseForm>)
    )

}

ManageCoursePage.propTypes = {
    course: PropTypes.object.isRequired,
    authors: PropTypes.array.isRequired,
    courses: PropTypes.array.isRequired,
    loadCourses: PropTypes.func.isRequired,
    saveCourse: PropTypes.func.isRequired,
    loadAuthors: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
};

// finds and returns course based on slug
export function getCourseBySlug(courses, slug) {
    return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
    const slug = ownProps.match.params.slug;
    const course = slug && state.courses.length > 0
        ? getCourseBySlug(state.courses, slug) : newCourse;
    return {
        course: course,
        courses: state.courses,
        authors: state.authors
    };
}

const mapDispatchToProps = {
    loadCourses,
    saveCourse,
    loadAuthors
};


export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
