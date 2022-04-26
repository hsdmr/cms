<?php

namespace Hasdemir\Controller;

use Hasdemir\Base\Codes as BaseCodes;

class Codes extends BaseCodes
{
  const JOB_ADMIN = 'admin';
  const JOB_LOGIN = 'loginAttempt';
  const JOB_LOGOUT = 'logout';
  const JOB_AUTH_CHECK = 'authCheck';
  const JOB_USER_SEARCH = 'userSearch';
  const JOB_USER_CREATE = 'userCreate';
  const JOB_USER_READ = 'userRead';
  const JOB_USER_UPDATE = 'userUpdate';
  const JOB_USER_DELETE = 'userDelete';
  const JOB_LAYOUT_SEARCH = 'userSearch';
  const JOB_LAYOUT_CREATE = 'userCreate';
  const JOB_LAYOUT_READ = 'userRead';
  const JOB_LAYOUT_UPDATE = 'userUpdate';
  const JOB_LAYOUT_DELETE = 'userDelete';
  const JOB_ROLE_SEARCH = 'roleSearch';
  const JOB_ROLE_CREATE = 'roleCreate';
  const JOB_ROLE_READ = 'roleRead';
  const JOB_ROLE_UPDATE = 'roleUpdate';
  const JOB_ROLE_DELETE = 'roleDelete';
  const JOB_POST_SEARCH = 'postSearch';
  const JOB_POST_CREATE = 'postCreate';
  const JOB_POST_READ = 'postRead';
  const JOB_POST_UPDATE = 'postUpdate';
  const JOB_POST_DELETE = 'postDelete';
  const JOB_SLUG_SEARCH = 'slugSearch';
  const JOB_SLUG_CREATE = 'slugCreate';
  const JOB_SLUG_READ = 'slugRead';
  const JOB_SLUG_UPDATE = 'slugUpdate';
  const JOB_SLUG_DELETE = 'slugDelete';
  const JOB_OPTION_SEARCH = 'optionSearch';
  const JOB_OPTION_CREATE = 'optionCreate';
  const JOB_OPTION_READ = 'optionRead';
  const JOB_OPTION_UPDATE = 'optionUpdate';
  const JOB_OPTION_DELETE = 'optionDelete';
  const JOB_CATEGORY_SEARCH = 'categorySearch';
  const JOB_CATEGORY_CREATE = 'categoryCreate';
  const JOB_CATEGORY_READ = 'categoryRead';
  const JOB_CATEGORY_UPDATE = 'categoryUpdate';
  const JOB_CATEGORY_DELETE = 'categoryDelete';
  const JOB_AUTO_LINK_SEARCH = 'autoLinkSearch';
  const JOB_AUTO_LINK_CREATE = 'autoLinkCreate';
  const JOB_AUTO_LINK_READ = 'autoLinkRead';
  const JOB_AUTO_LINK_UPDATE = 'autoLinkUpdate';
  const JOB_AUTO_LINK_DELETE = 'autoLinkDelete';

  const ERROR_USER_NOT_FOUND = 'userNotFound';
  const ERROR_FIRST_NAME_MUST_BE_STRING = 'firstNameMustBeString';
  const ERROR_LAST_NAME_MUST_BE_STRING = 'lastNameMustBeString';
  const ERROR_ROLE_NOT_ALLOWED = 'roleNotAllowed';
  const ERROR_EMAIL_NOT_VALID = 'emailNotValid';
  const ERROR_USERNAME_MUST_BE_SENT = 'usernameMustBeSent';
  const ERROR_PASSWORD_NOT_VALID = 'passwordNotValid';
  const ERROR_PASSWORDS_NOT_MATCH = 'passwordsNotMatch';
  const ERROR_LINK_NOT_FOUND = 'linkNotFound';
  const ERROR_OWNER_NOT_ALLOWED = 'ownerNotAllowed';
  const ERROR_PATH_MUST_BE_STRING = 'pathMustBeString';
  const ERROR_LANGUAGE_ID_MUST_BE_POSITIVE_NUMBER = 'languageIdMustBePositiveNumber';
  const ERROR_ROLE_CAN_NOT_DELETED_SOME_USERS_HAS_IT = 'roleCanNotDeletedSomeUsersHasIt';
  const ERROR_ROLE_NOT_FOUND = 'roleNotFound';
  const ERROR_ROLE_MUST_BE_SENT = 'roleMustBeSent';
  const ERROR_POST_NOT_FOUND = 'postNotFound';
  const ERROR_SLUG_ID_MUST_BE_POSITIVE_NUMBER = 'slugIdMustBePositiveNumber';
  const ERROR_USER_ID_MUST_BE_POSITIVE_NUMBER = 'userIdMustBePositiveNumber';
  const ERROR_STATUS_NOT_ALLOWED = 'statusNotAllowed';
  const ERROR_GET_NOT_ALLOWED = 'getNotAllowed';
  const ERROR_OPTION_NOT_FOUND = 'optionNotFound';
  const ERROR_OPTIONS_NOT_FOUND = 'optionsNotFound';
  const ERROR_TYPE_MUST_BE_STRING = 'typeMustBeString';
  const ERROR_TYPE_ID_MUST_BE_INTEGER = 'typeIdMustBeInteger';
  const ERROR_KEY_MUST_BE_STRING = 'keyMustBeString';
  const ERROR_CATEGORY_NOT_FOUND = 'categoryNotFound';
  const ERROR_FILE_ID_MUST_BE_POSITIVE_NUMBER = 'fileIdMustBePositiveNumber';
  const ERROR_PARENT_ID_MUST_BE_POSITIVE_NUMBER = 'parentIdMustBePositiveNumber';
  const ERROR_AUTO_LINK_NOT_FOUND = 'autoLinkNotFound';
  const ERROR_WORD_MUST_BE_STRING = 'wordMustBeString';
  const ERROR_URI_MUST_BE_STRING = 'uriMustBeString';
  const ERROR_LAYOUT_NOT_FOUND = 'userNotFound';
  
  const ERROR_TITLE_MUST_BE_STRING = 'titleMustBeString';
  const ERROR_TOP_MUST_BE_STRING = 'topMustBeString';
  const ERROR_CONTENT_MUST_BE_STRING = 'contentMustBeString';
  const ERROR_BOTTOM_MUST_BE_STRING = 'bottomMustBeString';
  const ERROR_WHICH_NOT_ALLOWED = 'whichNotAllowed';
  const ERROR_LANGUAGE_ID_MUST_BE_INTEGER = 'languageIdMustBeInteger';
}