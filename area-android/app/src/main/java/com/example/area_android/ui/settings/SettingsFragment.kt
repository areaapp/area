package com.example.area_android.ui.settings

import android.annotation.SuppressLint
import android.content.DialogInterface
import android.content.Intent
import android.os.Bundle
import android.text.InputType
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.LoginActivity
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.lelloman.identicon.view.GithubIdenticonView
import org.json.JSONArray
import org.json.JSONObject

class SettingsFragment : Fragment() {

    private lateinit var settingsViewModel: SettingsViewModel

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        settingsViewModel =
            ViewModelProviders.of(this).get(SettingsViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_settings, container, false)

        val app : AreaApplication = this.activity!!.application as AreaApplication
        val email = root.findViewById<TextView>(R.id.settings_email_text)
        val username = root.findViewById<TextView>(R.id.settings_username_text)
        val avatar = root.findViewById<GithubIdenticonView>(R.id.avatar)
        val changeUsername = root.findViewById<Button>(R.id.modifyUsername)
        val changePassword = root.findViewById<Button>(R.id.modifyPassword)

        val url : String = app.serverUrl + "/me"
        Fuel.get(url)
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                    }
                    is Result.Success -> {
                        val obj : JSONObject = result.get().obj()
                        val data : JSONObject = obj.getJSONObject("data")

                        println(data)

                        email.text = "Email : " + data.getString("email")
                        username.text = data.getString("username")
                        avatar.hash = data.getString("avatar").hashCode()

                        if (data.getString("register_source") != "area") {
                            changePassword.isEnabled = false
                        }
                    }
                }
            }


        changeUsername.setOnClickListener {
            val usernameEdit = EditText(this.activity)
            usernameEdit.hint = "New username"
            AlertDialog.Builder(this.activity!!)
                .setTitle("Change username")
                .setMessage("Enter the new username")
                .setView(usernameEdit)
                .setPositiveButton("Ok") { _, _ ->

                    val requestData = hashMapOf<String, Any?>(
                        "username" to usernameEdit.text.toString()
                    )

                    Fuel.put(app.serverUrl + "/me")
                        .authentication()
                        .bearer(app.token!!)
                        .jsonBody(JSONObject(requestData).toString())
                        .responseJson { request, response, result ->
                            when (result) {
                                is Result.Failure -> {
                                    Toast.makeText(this.activity, "Request failed", Toast.LENGTH_SHORT).show()
                                }
                                is Result.Success -> {
                                    val obj : JSONObject = result.get().obj()
                                    val data : JSONObject = obj.getJSONObject("data")

                                    username.text = data.getString("username")
                                    Toast.makeText(this.activity, "Success", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                }
                .setNegativeButton("Cancel", null)
                .show()

        }

        changePassword.setOnClickListener {
            val passwordEdit = EditText(this.activity)
            passwordEdit.hint = "New username"
            passwordEdit.inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
            AlertDialog.Builder(this.activity!!)
                .setTitle("Change password")
                .setMessage("Enter the new password")
                .setView(passwordEdit)
                .setPositiveButton("Ok") { _, _ ->

                    val requestData = hashMapOf<String, Any?>(
                        "password" to passwordEdit.text.toString()
                    )

                    Fuel.put(app.serverUrl + "/me")
                        .authentication()
                        .bearer(app.token!!)
                        .jsonBody(JSONObject(requestData).toString())
                        .responseJson { request, response, result ->
                            when (result) {
                                is Result.Failure -> {
                                    Toast.makeText(this.activity, "Request failed", Toast.LENGTH_SHORT).show()
                                }
                                is Result.Success -> {
                                    Toast.makeText(this.activity, "Success", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                }
                .setNegativeButton("Cancel", null)
                .show()

        }

        val logoutButton = root.findViewById<Button>(R.id.logoutButton)
        logoutButton.setOnClickListener {
            app.token = ""
            val intent = Intent(this.activity, LoginActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            this.activity!!.finish()
        }

        return root
    }
}