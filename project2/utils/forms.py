from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators
from wtforms.validators import ValidationError, StopValidation


################
# Actual Forms #
################
class UserForm(FlaskForm):
    displayname = StringField(id="displayname", label='Display name', validators=[validators.Length(min=4, max=18)])
    password = PasswordField(id="password", label='Password', validators=[validators.Length(min=4, max=18)])
